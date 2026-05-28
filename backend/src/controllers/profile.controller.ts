import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { fullName, bio, phone, address, city, fields } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { fullName, bio, phone, address, city, fields },
      create: { userId: user.id, fullName, bio, phone, address, city, fields },
    });

    res.json({ success: true, data: profile, message: 'Cập nhật hồ sơ thành công' });
  } catch (err) { next(err); }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    if (!req.file) throw ApiError.badRequest('Không tìm thấy file');

    const { uploadToCloudinary } = await import('../utils/cloudinary');
    const avatarUrl = await uploadToCloudinary(req.file.buffer, 'avatars');

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { avatarUrl },
      create: { userId: user.id, avatarUrl },
    });

    res.json({ success: true, data: { avatarUrl: profile.avatarUrl }, message: 'Cập nhật ảnh đại diện thành công' });
  } catch (err) { next(err); }
};

export const getReviewerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const reviewer = await prisma.reviewerProfile.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true, email: true, isVerified: true,
            profile: true,
          },
        },
      },
    });
    if (!reviewer) throw ApiError.notFound('Không tìm thấy hồ sơ reviewer');
    res.json({ success: true, data: reviewer });
  } catch (err) { next(err); }
};

export const updateReviewerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const {
      igHandle, tiktokHandle, ytHandle, fbHandle,
      followersIg, followersTiktok, followersYt, followersFb,
      engagementRate, specialties,
    } = req.body;

    const profile = await prisma.reviewerProfile.upsert({
      where: { userId: user.id },
      update: {
        igHandle, tiktokHandle, ytHandle, fbHandle,
        followersIg, followersTiktok, followersYt, followersFb,
        engagementRate, specialties,
      },
      create: {
        userId: user.id,
        igHandle, tiktokHandle, ytHandle, fbHandle,
        followersIg, followersTiktok, followersYt, followersFb,
        engagementRate, specialties: specialties || [],
      },
    });

    res.json({ success: true, data: profile, message: 'Cập nhật hồ sơ Reviewer thành công' });
  } catch (err) { next(err); }
};

export const updateAdvertiserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { companyName, website, description, industry, taxCode } = req.body;

    const profile = await prisma.advertiserProfile.upsert({
      where: { userId: user.id },
      update: { companyName, website, description, industry, taxCode },
      create: { userId: user.id, companyName, website, description, industry, taxCode },
    });

    res.json({ success: true, data: profile, message: 'Cập nhật hồ sơ doanh nghiệp thành công' });
  } catch (err) { next(err); }
};

export const uploadCompanyLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    if (!req.file) throw ApiError.badRequest('Không tìm thấy file');

    const { uploadToCloudinary } = await import('../utils/cloudinary');
    const logoUrl = await uploadToCloudinary(req.file.buffer, 'logos');

    const profile = await prisma.advertiserProfile.upsert({
      where: { userId: user.id },
      update: { logoUrl },
      create: { userId: user.id, logoUrl },
    });

    res.json({ success: true, data: { logoUrl: profile.logoUrl } });
  } catch (err) { next(err); }
};
