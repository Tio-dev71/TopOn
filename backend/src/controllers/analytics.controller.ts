import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getCampaignAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id: campaignId } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (!campaign) throw ApiError.notFound('Không tìm thấy chiến dịch');
    if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') throw ApiError.forbidden();

    const [totalApplications, approvedApplications, totalContents, approvedContents, rejectedContents, budgetAllocations] =
      await Promise.all([
        prisma.campaignApplication.count({ where: { campaignId } }),
        prisma.campaignApplication.count({ where: { campaignId, status: 'APPROVED' } }),
        prisma.campaignContent.count({ where: { application: { campaignId } } }),
        prisma.campaignContent.count({ where: { application: { campaignId }, status: 'APPROVED' } }),
        prisma.campaignContent.count({ where: { application: { campaignId }, status: 'REJECTED' } }),
        prisma.budgetAllocation.findMany({ where: { campaignId } }),
      ]);

    const totalAllocated = budgetAllocations.reduce((sum, b) => sum + b.allocatedAmt, 0);
    const usedBudget = approvedContents * campaign.budgetPerReviewer;
    const costPerContent = approvedContents > 0 ? usedBudget / approvedContents : 0;

    res.json({
      success: true,
      data: {
        campaign: { id: campaign.id, title: campaign.title, status: campaign.status },
        reviewers: {
          total: totalApplications,
          approved: approvedApplications,
          rate: totalApplications > 0 ? (approvedApplications / totalApplications * 100).toFixed(1) : 0,
        },
        content: {
          total: totalContents,
          approved: approvedContents,
          rejected: rejectedContents,
          pending: totalContents - approvedContents - rejectedContents,
          approvalRate: totalContents > 0 ? (approvedContents / totalContents * 100).toFixed(1) : 0,
        },
        budget: {
          allocated: totalAllocated,
          used: usedBudget,
          remaining: totalAllocated - usedBudget,
          costPerContent: costPerContent.toFixed(0),
        },
      },
    });
  } catch (err) { next(err); }
};

export const getAdvertiserOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    const advertiser = await prisma.advertiserProfile.findUnique({ where: { userId: user.id } });
    if (!advertiser) throw ApiError.notFound('Hồ sơ doanh nghiệp không tồn tại');

    const [
      totalCampaigns, activeCampaigns, totalReviewers,
      totalContents, approvedContents, wallet,
    ] = await Promise.all([
      prisma.campaign.count({ where: { advertiserId: advertiser.id } }),
      prisma.campaign.count({ where: { advertiserId: advertiser.id, status: 'ACTIVE' } }),
      prisma.campaignApplication.count({
        where: { campaign: { advertiserId: advertiser.id }, status: 'APPROVED' },
      }),
      prisma.campaignContent.count({
        where: { application: { campaign: { advertiserId: advertiser.id } } },
      }),
      prisma.campaignContent.count({
        where: { application: { campaign: { advertiserId: advertiser.id } }, status: 'APPROVED' },
      }),
      prisma.wallet.findUnique({ where: { userId: user.id } }),
    ]);

    res.json({
      success: true,
      data: {
        campaigns: { total: totalCampaigns, active: activeCampaigns },
        reviewers: totalReviewers,
        content: { total: totalContents, approved: approvedContents },
        wallet: { balance: wallet?.balance || 0, locked: wallet?.lockedBalance || 0 },
      },
    });
  } catch (err) { next(err); }
};

export const getReviewerOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    const reviewer = await prisma.reviewerProfile.findUnique({ where: { userId: user.id } });
    if (!reviewer) throw ApiError.notFound('Hồ sơ Reviewer không tồn tại');

    const [
      totalApplications, approvedApplications,
      totalContents, approvedContents, wallet,
    ] = await Promise.all([
      prisma.campaignApplication.count({ where: { reviewerId: reviewer.id } }),
      prisma.campaignApplication.count({ where: { reviewerId: reviewer.id, status: 'APPROVED' } }),
      prisma.campaignContent.count({ where: { application: { reviewerId: reviewer.id } } }),
      prisma.campaignContent.count({
        where: { application: { reviewerId: reviewer.id }, status: 'APPROVED' },
      }),
      prisma.wallet.findUnique({ where: { userId: user.id } }),
    ]);

    const totalEarnings = approvedContents * (reviewer.engagementRate || 0);

    res.json({
      success: true,
      data: {
        campaigns: { total: totalApplications, approved: approvedApplications },
        content: { total: totalContents, approved: approvedContents },
        wallet: { balance: wallet?.balance || 0 },
        rating: reviewer.avgRating,
        totalCampaigns: reviewer.totalCampaigns,
      },
    });
  } catch (err) { next(err); }
};
