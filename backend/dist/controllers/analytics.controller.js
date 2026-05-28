"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewerOverview = exports.getAdvertiserOverview = exports.getCampaignAnalytics = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const getCampaignAnalytics = async (req, res, next) => {
    try {
        const user = req.user;
        const { id: campaignId } = req.params;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (!campaign)
            throw ApiError_1.ApiError.notFound('Không tìm thấy chiến dịch');
        if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN')
            throw ApiError_1.ApiError.forbidden();
        const [totalApplications, approvedApplications, totalContents, approvedContents, rejectedContents, budgetAllocations] = await Promise.all([
            prisma_1.default.campaignApplication.count({ where: { campaignId } }),
            prisma_1.default.campaignApplication.count({ where: { campaignId, status: 'APPROVED' } }),
            prisma_1.default.campaignContent.count({ where: { application: { campaignId } } }),
            prisma_1.default.campaignContent.count({ where: { application: { campaignId }, status: 'APPROVED' } }),
            prisma_1.default.campaignContent.count({ where: { application: { campaignId }, status: 'REJECTED' } }),
            prisma_1.default.budgetAllocation.findMany({ where: { campaignId } }),
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
    }
    catch (err) {
        next(err);
    }
};
exports.getCampaignAnalytics = getCampaignAnalytics;
const getAdvertiserOverview = async (req, res, next) => {
    try {
        const user = req.user;
        const advertiser = await prisma_1.default.advertiserProfile.findUnique({ where: { userId: user.id } });
        if (!advertiser)
            throw ApiError_1.ApiError.notFound('Hồ sơ doanh nghiệp không tồn tại');
        const [totalCampaigns, activeCampaigns, totalReviewers, totalContents, approvedContents, wallet,] = await Promise.all([
            prisma_1.default.campaign.count({ where: { advertiserId: advertiser.id } }),
            prisma_1.default.campaign.count({ where: { advertiserId: advertiser.id, status: 'ACTIVE' } }),
            prisma_1.default.campaignApplication.count({
                where: { campaign: { advertiserId: advertiser.id }, status: 'APPROVED' },
            }),
            prisma_1.default.campaignContent.count({
                where: { application: { campaign: { advertiserId: advertiser.id } } },
            }),
            prisma_1.default.campaignContent.count({
                where: { application: { campaign: { advertiserId: advertiser.id } }, status: 'APPROVED' },
            }),
            prisma_1.default.wallet.findUnique({ where: { userId: user.id } }),
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
    }
    catch (err) {
        next(err);
    }
};
exports.getAdvertiserOverview = getAdvertiserOverview;
const getReviewerOverview = async (req, res, next) => {
    try {
        const user = req.user;
        const reviewer = await prisma_1.default.reviewerProfile.findUnique({ where: { userId: user.id } });
        if (!reviewer)
            throw ApiError_1.ApiError.notFound('Hồ sơ Reviewer không tồn tại');
        const [totalApplications, approvedApplications, totalContents, approvedContents, wallet,] = await Promise.all([
            prisma_1.default.campaignApplication.count({ where: { reviewerId: reviewer.id } }),
            prisma_1.default.campaignApplication.count({ where: { reviewerId: reviewer.id, status: 'APPROVED' } }),
            prisma_1.default.campaignContent.count({ where: { application: { reviewerId: reviewer.id } } }),
            prisma_1.default.campaignContent.count({
                where: { application: { reviewerId: reviewer.id }, status: 'APPROVED' },
            }),
            prisma_1.default.wallet.findUnique({ where: { userId: user.id } }),
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
    }
    catch (err) {
        next(err);
    }
};
exports.getReviewerOverview = getReviewerOverview;
//# sourceMappingURL=analytics.controller.js.map