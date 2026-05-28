import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const createRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { toUserId, campaignId, stars, comment } = req.body;

    if (user.id === toUserId) throw ApiError.badRequest('Không thể tự đánh giá bản thân');
    if (stars < 1 || stars > 5) throw ApiError.badRequest('Rating phải từ 1-5 sao');

    const existing = await prisma.rating.findUnique({
      where: { fromUserId_toUserId_campaignId: { fromUserId: user.id, toUserId, campaignId: campaignId || '' } },
    });
    if (existing) throw ApiError.conflict('Bạn đã đánh giá người dùng này cho chiến dịch này');

    const rating = await prisma.rating.create({
      data: { fromUserId: user.id, toUserId, campaignId, stars, comment },
    });

    // Recalculate avg rating
    const ratings = await prisma.rating.findMany({ where: { toUserId } });
    const avgRating = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;

    // Update reviewer or advertiser profile
    const targetUser = await prisma.user.findUnique({ where: { id: toUserId } });
    if (targetUser?.role === 'REVIEWER') {
      await prisma.reviewerProfile.updateMany({
        where: { userId: toUserId },
        data: { avgRating },
      });
    } else if (targetUser?.role === 'ADVERTISER') {
      await prisma.advertiserProfile.updateMany({
        where: { userId: toUserId },
        data: { avgRating },
      });
    }

    res.status(201).json({ success: true, data: rating, message: 'Đánh giá thành công' });
  } catch (err) { next(err); }
};

export const getUserRatings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: {
          include: { profile: { select: { fullName: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
      : 0;

    res.json({ success: true, data: { ratings, avgRating: avgRating.toFixed(1), total: ratings.length } });
  } catch (err) { next(err); }
};
