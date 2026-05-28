"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.oauthCallback = exports.logout = exports.refreshToken = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.disable2FA = exports.enable2FA = exports.setup2FA = exports.verify2FA = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const otplib_1 = require("otplib");
const qrcode_1 = __importDefault(require("qrcode"));
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const register = async (req, res, next) => {
    try {
        const { email, password, role = 'REVIEWER', fullName } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            throw ApiError_1.ApiError.conflict('Email đã được sử dụng');
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const verifyToken = (0, uuid_1.v4)();
        const user = await prisma_1.default.user.create({
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
        await (0, email_1.sendVerificationEmail)(email, verifyToken);
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
            data: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash)
            throw ApiError_1.ApiError.unauthorized('Email hoặc mật khẩu không đúng');
        if (!user.isActive)
            throw ApiError_1.ApiError.forbidden('Tài khoản đã bị khóa');
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            throw ApiError_1.ApiError.unauthorized('Email hoặc mật khẩu không đúng');
        if (user.twoFaEnabled) {
            return res.json({
                success: true,
                requires2FA: true,
                tempToken: (0, jwt_1.generateAccessToken)(user.id, user.role), // Short-lived for 2FA step
            });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const refreshToken = await (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        const profile = await prisma_1.default.profile.findUnique({ where: { userId: user.id } });
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
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const verify2FA = async (req, res, next) => {
    try {
        const { userId, token } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFaSecret)
            throw ApiError_1.ApiError.badRequest('Thông tin không hợp lệ');
        const isValid = otplib_1.authenticator.verify({ token, secret: user.twoFaSecret });
        if (!isValid)
            throw ApiError_1.ApiError.badRequest('Mã OTP không hợp lệ hoặc đã hết hạn');
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const refreshToken = await (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({ success: true, data: { accessToken } });
    }
    catch (err) {
        next(err);
    }
};
exports.verify2FA = verify2FA;
const setup2FA = async (req, res, next) => {
    try {
        const user = req.user;
        const secret = otplib_1.authenticator.generateSecret();
        const otpauth = otplib_1.authenticator.keyuri(user.email, 'TopOn', secret);
        const qrCodeUrl = await qrcode_1.default.toDataURL(otpauth);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { twoFaSecret: secret },
        });
        res.json({ success: true, data: { qrCodeUrl, secret } });
    }
    catch (err) {
        next(err);
    }
};
exports.setup2FA = setup2FA;
const enable2FA = async (req, res, next) => {
    try {
        const user = req.user;
        const { token } = req.body;
        const dbUser = await prisma_1.default.user.findUnique({ where: { id: user.id } });
        if (!dbUser?.twoFaSecret)
            throw ApiError_1.ApiError.badRequest('Chưa thiết lập 2FA');
        const isValid = otplib_1.authenticator.verify({ token, secret: dbUser.twoFaSecret });
        if (!isValid)
            throw ApiError_1.ApiError.badRequest('Mã OTP không hợp lệ');
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { twoFaEnabled: true },
        });
        res.json({ success: true, message: 'Bật xác thực 2 lớp thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.enable2FA = enable2FA;
const disable2FA = async (req, res, next) => {
    try {
        const user = req.user;
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { twoFaEnabled: false, twoFaSecret: null },
        });
        res.json({ success: true, message: 'Tắt xác thực 2 lớp thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.disable2FA = disable2FA;
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const user = await prisma_1.default.user.findFirst({ where: { verifyToken: token } });
        if (!user)
            throw ApiError_1.ApiError.badRequest('Token không hợp lệ');
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { isVerified: true, verifyToken: null },
        });
        res.json({ success: true, message: 'Xác thực email thành công!' });
    }
    catch (err) {
        next(err);
    }
};
exports.verifyEmail = verifyEmail;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (user) {
            const resetToken = (0, uuid_1.v4)();
            const resetTokenExp = new Date(Date.now() + 3600 * 1000); // 1 hour
            await prisma_1.default.user.update({
                where: { id: user.id },
                data: { resetToken, resetTokenExp },
            });
            await (0, email_1.sendPasswordResetEmail)(email, resetToken);
        }
        res.json({ success: true, message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' });
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const user = await prisma_1.default.user.findFirst({
            where: { resetToken: token, resetTokenExp: { gt: new Date() } },
        });
        if (!user)
            throw ApiError_1.ApiError.badRequest('Token không hợp lệ hoặc đã hết hạn');
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { passwordHash, resetToken: null, resetTokenExp: null },
        });
        res.json({ success: true, message: 'Đặt lại mật khẩu thành công!' });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token)
            throw ApiError_1.ApiError.unauthorized('Không có refresh token');
        const record = await (0, jwt_1.verifyRefreshToken)(token);
        const user = await prisma_1.default.user.findUnique({ where: { id: record.userId } });
        if (!user || !user.isActive)
            throw ApiError_1.ApiError.unauthorized();
        await (0, jwt_1.revokeRefreshToken)(token);
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const newRefreshToken = await (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({ success: true, data: { accessToken } });
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token)
            await (0, jwt_1.revokeRefreshToken)(token);
        res.clearCookie('refreshToken');
        res.json({ success: true, message: 'Đăng xuất thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
const oauthCallback = (req, res) => {
    const user = req.user;
    const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/oauth-callback?token=${accessToken}`);
};
exports.oauthCallback = oauthCallback;
const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        const fullUser = await prisma_1.default.user.findUnique({
            where: { id: user.id },
            include: {
                profile: true,
                reviewerProfile: true,
                advertiserProfile: true,
                wallet: { select: { balance: true, currency: true } },
            },
        });
        const { passwordHash, twoFaSecret, verifyToken, resetToken, ...safeUser } = fullUser;
        res.json({ success: true, data: safeUser });
    }
    catch (err) {
        next(err);
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map