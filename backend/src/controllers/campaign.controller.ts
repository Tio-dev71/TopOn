import { Request, Response, NextFunction } from 'express';
import { User, CampaignStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1', limit = '12', status, type, platform,
      category, search, minBudget, maxBudget, sortBy = 'createdAt', order = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    else where.status = 'ACTIVE';

    if (type) where.type = type;
    if (category) where.categories = { has: category };
    if (platform) where.platforms = { has: platform };
    if (minBudget || maxBudget) {
      where.budgetPerReviewer = {};
      if (minBudget) where.budgetPerReviewer.gte = parseFloat(minBudget);
      if (maxBudget) where.budgetPerReviewer.lte = parseFloat(maxBudget);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: order },
        include: {
          advertiser: {
            include: { user: { include: { profile: true } } },
          },
          _count: { select: { applications: true } },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    res.json({
      success: true,
      data: campaigns,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const getCampaignById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        advertiser: {
          include: { user: { include: { profile: true } } },
        },
        _count: { select: { applications: true } },
      },
    });
    if (!campaign) throw ApiError.notFound('Không tìm thấy chiến dịch');
    res.json({ success: true, data: campaign });
  } catch (err) { next(err); }
};

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    const advertiser = await prisma.advertiserProfile.findUnique({ where: { userId: user.id } });
    if (!advertiser) throw ApiError.badRequest('Bạn cần hoàn thiện hồ sơ doanh nghiệp trước');

    const {
      title, description, type, objectives, contentRequirements,
      budgetTotal, budgetPerReviewer, maxReviewers, deadline,
      startDate, endDate, platforms, categories, coverUrl, productImages,
    } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        advertiserId: advertiser.id,
        title, description, type, objectives, contentRequirements,
        budgetTotal: parseFloat(budgetTotal),
        budgetPerReviewer: parseFloat(budgetPerReviewer),
        maxReviewers: parseInt(maxReviewers) || 10,
        deadline: deadline ? new Date(deadline) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        platforms: platforms || [],
        categories: categories || [],
        coverUrl, productImages: productImages || [],
      },
    });

    res.status(201).json({ success: true, data: campaign, message: 'Tạo chiến dịch thành công' });
  } catch (err) { next(err); }
};

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { advertiser: true },
    });

    if (!campaign) throw ApiError.notFound('Không tìm thấy chiến dịch');
    if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') {
      throw ApiError.forbidden();
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        ...req.body,
        budgetTotal: req.body.budgetTotal ? parseFloat(req.body.budgetTotal) : undefined,
        budgetPerReviewer: req.body.budgetPerReviewer ? parseFloat(req.body.budgetPerReviewer) : undefined,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
      },
    });

    res.json({ success: true, data: updated, message: 'Cập nhật chiến dịch thành công' });
  } catch (err) { next(err); }
};

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { advertiser: true },
    });

    if (!campaign) throw ApiError.notFound('Không tìm thấy chiến dịch');
    if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') {
      throw ApiError.forbidden();
    }

    await prisma.campaign.update({
      where: { id },
      data: { status: CampaignStatus.CANCELLED },
    });

    res.json({ success: true, message: 'Hủy chiến dịch thành công' });
  } catch (err) { next(err); }
};

export const getMyAdvertiserCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { page = '1', limit = '10', status } = req.query as Record<string, string>;

    const advertiser = await prisma.advertiserProfile.findUnique({ where: { userId: user.id } });
    if (!advertiser) throw ApiError.notFound('Hồ sơ doanh nghiệp không tồn tại');

    const where: any = { advertiserId: advertiser.id };
    if (status) where.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { applications: true } } },
      }),
      prisma.campaign.count({ where }),
    ]);

    res.json({
      success: true,
      data: campaigns,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const applyToCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id: campaignId } = req.params;
    const { note } = req.body;

    const reviewer = await prisma.reviewerProfile.findUnique({ where: { userId: user.id } });
    if (!reviewer) throw ApiError.badRequest('Bạn cần hoàn thiện hồ sơ Reviewer trước');

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status !== 'ACTIVE') throw ApiError.notFound('Chiến dịch không tồn tại hoặc không còn hoạt động');

    const existing = await prisma.campaignApplication.findUnique({
      where: { campaignId_reviewerId: { campaignId, reviewerId: reviewer.id } },
    });
    if (existing) throw ApiError.conflict('Bạn đã đăng ký tham gia chiến dịch này');

    const application = await prisma.campaignApplication.create({
      data: { campaignId, reviewerId: reviewer.id, note },
    });

    // Notify advertiser
    const io = req.app.get('io');
    const campaign2 = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (io && campaign2) {
      const { createNotification } = await import('./notification.controller');
      await createNotification(io, campaign2.advertiser.userId, {
        type: 'CAMPAIGN_INVITE',
        title: 'Reviewer mới đăng ký',
        message: `Có reviewer mới đăng ký chiến dịch "${campaign.title}"`,
        link: `/dashboard/campaigns/${campaignId}/applications`,
      });
    }

    res.status(201).json({ success: true, data: application, message: 'Đăng ký tham gia chiến dịch thành công' });
  } catch (err) { next(err); }
};

export const getCampaignApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id: campaignId } = req.params;
    const { status } = req.query as Record<string, string>;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (!campaign) throw ApiError.notFound('Không tìm thấy chiến dịch');
    if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') throw ApiError.forbidden();

    const where: any = { campaignId };
    if (status) where.status = status;

    const applications = await prisma.campaignApplication.findMany({
      where,
      include: {
        reviewer: {
          include: { user: { include: { profile: true } } },
        },
        _count: { select: { contents: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json({ success: true, data: applications });
  } catch (err) { next(err); }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id: campaignId, appId } = req.params;
    const { status, note } = req.body;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (!campaign || campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') throw ApiError.forbidden();

    const application = await prisma.campaignApplication.update({
      where: { id: appId },
      data: { status, note },
      include: { reviewer: true },
    });

    // Notify reviewer
    const io = req.app.get('io');
    if (io) {
      const { createNotification } = await import('./notification.controller');
      const notifType = status === 'APPROVED' ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED';
      await createNotification(io, application.reviewer.userId, {
        type: notifType,
        title: status === 'APPROVED' ? 'Đơn đăng ký được chấp thuận!' : 'Đơn đăng ký bị từ chối',
        message: `Chiến dịch: "${campaign.title}"`,
        link: `/reviewer/campaigns/${campaignId}`,
      });
    }

    res.json({ success: true, data: application, message: 'Cập nhật trạng thái thành công' });
  } catch (err) { next(err); }
};

export const getReviewerCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { status } = req.query as Record<string, string>;

    const reviewer = await prisma.reviewerProfile.findUnique({ where: { userId: user.id } });
    if (!reviewer) throw ApiError.notFound('Hồ sơ Reviewer không tồn tại');

    const where: any = { reviewerId: reviewer.id };
    if (status) where.status = status;

    const applications = await prisma.campaignApplication.findMany({
      where,
      include: {
        campaign: {
          include: { advertiser: { include: { user: { include: { profile: true } } } } },
        },
        _count: { select: { contents: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json({ success: true, data: applications });
  } catch (err) { next(err); }
};
