import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import passport from 'passport';
import { User } from '@prisma/client';

import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail, sendOTPEmail } from '../utils/email';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role = 'REVIEWER', fullName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict('Email đã được sử dụng');

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        verifyToken,
        profile: {
          create: { fullName },
        },
        wallet: {
          create: {},
        },
        ...(role === 'REVIEWER' && { reviewerProfile: { create: {} } }),
        ...(role === 'ADVERTISER' && { advertiserProfile: { create: {} } }),
      },
    });

    await sendVerificationEmail(email, verifyToken);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      data: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');
    if (!user.isActive) throw ApiError.forbidden('Tài khoản đã bị khóa');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');

    if (user.twoFaEnabled) {
      return res.json({
        success: true,
        requires2FA: true,
        tempToken: generateAccessToken(user.id, user.role), // Short-lived for 2FA step
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          profile,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFaSecret) throw ApiError.badRequest('Thông tin không hợp lệ');

    const isValid = authenticator.verify({ token, secret: user.twoFaSecret });
    if (!isValid) throw ApiError.badRequest('Mã OTP không hợp lệ hoặc đã hết hạn');

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const setup2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'TopOn', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFaSecret: secret },
    });

    res.json({ success: true, data: { qrCodeUrl, secret } });
  } catch (err) {
    next(err);
  }
};

export const enable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { token } = req.body;

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser?.twoFaSecret) throw ApiError.badRequest('Chưa thiết lập 2FA');

    const isValid = authenticator.verify({ token, secret: dbUser.twoFaSecret });
    if (!isValid) throw ApiError.badRequest('Mã OTP không hợp lệ');

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFaEnabled: true },
    });

    res.json({ success: true, message: 'Bật xác thực 2 lớp thành công' });
  } catch (err) {
    next(err);
  }
};

export const disable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFaEnabled: false, twoFaSecret: null },
    });
    res.json({ success: true, message: 'Tắt xác thực 2 lớp thành công' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    const user = await prisma.user.findFirst({ where: { verifyToken: token as string } });
    if (!user) throw ApiError.badRequest('Token không hợp lệ');

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null },
    });

    res.json({ success: true, message: 'Xác thực email thành công!' });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = uuidv4();
      const resetTokenExp = new Date(Date.now() + 3600 * 1000); // 1 hour
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExp },
      });
      await sendPasswordResetEmail(email, resetToken);
    }

    res.json({ success: true, message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gt: new Date() } },
    });
    if (!user) throw ApiError.badRequest('Token không hợp lệ hoặc đã hết hạn');

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExp: null },
    });

    res.json({ success: true, message: 'Đặt lại mật khẩu thành công!' });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) throw ApiError.unauthorized('Không có refresh token');

    const record = await verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user || !user.isActive) throw ApiError.unauthorized();

    await revokeRefreshToken(token);
    const accessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = await generateRefreshToken(user.id);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) await revokeRefreshToken(token);

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (err) {
    next(err);
  }
};

export const oauthCallback = (req: Request, res: Response) => {
  const user = req.user as User;
  const accessToken = generateAccessToken(user.id, user.role);
  const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/auth/oauth-callback?token=${accessToken}`);
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        reviewerProfile: true,
        advertiserProfile: true,
        wallet: { select: { balance: true, currency: true } },
      },
    });

    const { passwordHash, twoFaSecret, verifyToken, resetToken, ...safeUser } = fullUser!;

    res.json({ success: true, data: safeUser });
  } catch (err) {
    next(err);
  }
};
