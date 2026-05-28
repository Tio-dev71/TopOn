import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const searchReviewers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1', limit = '12', field, specialty,
      minFollowers, platform, location, search,
      sortBy = 'avgRating', order = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (specialty) where.specialties = { has: specialty };
    if (search) {
      where.OR = [
        { igHandle: { contains: search, mode: 'insensitive' } },
        { tiktokHandle: { contains: search, mode: 'insensitive' } },
        { user: { profile: { fullName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (minFollowers) {
      const min = parseInt(minFollowers);
      where.OR = [
        ...(where.OR || []),
        { followersIg: { gte: min } },
        { followersTiktok: { gte: min } },
        { followersYt: { gte: min } },
      ];
    }

    const validSortFields = ['avgRating', 'totalCampaigns', 'followersIg', 'followersTiktok', 'engagementRate'];
    const safeSort = validSortFields.includes(sortBy) ? sortBy : 'avgRating';

    const [reviewers, total] = await Promise.all([
      prisma.reviewerProfile.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [safeSort]: order as 'asc' | 'desc' },
        include: {
          user: {
            select: {
              id: true, email: true, isVerified: true,
              profile: { select: { fullName: true, avatarUrl: true, city: true, fields: true } },
            },
          },
        },
      }),
      prisma.reviewerProfile.count({ where }),
    ]);

    res.json({
      success: true,
      data: reviewers,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const getReviewerDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const reviewer = await prisma.reviewerProfile.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true, email: true, isVerified: true,
            profile: true,
            ratingsReceived: {
              take: 5,
              orderBy: { createdAt: 'desc' },
              include: { fromUser: { include: { profile: { select: { fullName: true, avatarUrl: true } } } } },
            },
          },
        },
      },
    });

    if (!reviewer) throw ApiError.notFound('Không tìm thấy Reviewer');
    res.json({ success: true, data: reviewer });
  } catch (err) { next(err); }
};

export const inviteReviewer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id: reviewerUserId } = req.params;
    const { campaignId, message } = req.body;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (!campaign || campaign.advertiser.userId !== user.id) throw ApiError.forbidden();

    const io = req.app.get('io');
    if (io) {
      const { createNotification } = await import('./notification.controller');
      await createNotification(io, reviewerUserId, {
        type: 'CAMPAIGN_INVITE',
        title: `📢 Bạn được mời tham gia chiến dịch!`,
        message: message || `Chiến dịch: "${campaign.title}"`,
        link: `/campaigns/${campaignId}`,
      });
    }

    res.json({ success: true, message: 'Đã gửi lời mời đến Reviewer' });
  } catch (err) { next(err); }
};

export const bookmarkReviewer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id: reviewerUserId } = req.params;

    const reviewer = await prisma.reviewerProfile.findFirst({ where: { userId: reviewerUserId } });
    if (!reviewer) throw ApiError.notFound('Reviewer không tồn tại');

    const existing = await prisma.bookmark.findUnique({
      where: { advertiserId_reviewerId: { advertiserId: user.id, reviewerId: reviewer.id } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ success: true, bookmarked: false, message: 'Đã xóa bookmark' });
    }

    await prisma.bookmark.create({ data: { advertiserId: user.id, reviewerId: reviewer.id } });
    res.json({ success: true, bookmarked: true, message: 'Đã bookmark Reviewer' });
  } catch (err) { next(err); }
};

export const getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    const bookmarks = await prisma.bookmark.findMany({
      where: { advertiserId: user.id },
      include: {
        reviewer: {
          include: {
            user: {
              select: {
                id: true,
                profile: { select: { fullName: true, avatarUrl: true, city: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: bookmarks });
  } catch (err) { next(err); }
};
