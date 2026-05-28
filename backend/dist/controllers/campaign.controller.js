"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewerCampaigns = exports.updateApplicationStatus = exports.getCampaignApplications = exports.applyToCampaign = exports.getMyAdvertiserCampaigns = exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getCampaigns = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const getCampaigns = async (req, res, next) => {
    try {
        const { page = '1', limit = '12', status, type, platform, category, search, minBudget, maxBudget, sortBy = 'createdAt', order = 'desc', } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status)
            where.status = status;
        else
            where.status = 'ACTIVE';
        if (type)
            where.type = type;
        if (category)
            where.categories = { has: category };
        if (platform)
            where.platforms = { has: platform };
        if (minBudget || maxBudget) {
            where.budgetPerReviewer = {};
            if (minBudget)
                where.budgetPerReviewer.gte = parseFloat(minBudget);
            if (maxBudget)
                where.budgetPerReviewer.lte = parseFloat(maxBudget);
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [campaigns, total] = await Promise.all([
            prisma_1.default.campaign.findMany({
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
            prisma_1.default.campaign.count({ where }),
        ]);
        res.json({
            success: true,
            data: campaigns,
            meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getCampaigns = getCampaigns;
const getCampaignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id },
            include: {
                advertiser: {
                    include: { user: { include: { profile: true } } },
                },
                _count: { select: { applications: true } },
            },
        });
        if (!campaign)
            throw ApiError_1.ApiError.notFound('Không tìm thấy chiến dịch');
        res.json({ success: true, data: campaign });
    }
    catch (err) {
        next(err);
    }
};
exports.getCampaignById = getCampaignById;
const createCampaign = async (req, res, next) => {
    try {
        const user = req.user;
        const advertiser = await prisma_1.default.advertiserProfile.findUnique({ where: { userId: user.id } });
        if (!advertiser)
            throw ApiError_1.ApiError.badRequest('Bạn cần hoàn thiện hồ sơ doanh nghiệp trước');
        const { title, description, type, objectives, contentRequirements, budgetTotal, budgetPerReviewer, maxReviewers, deadline, startDate, endDate, platforms, categories, coverUrl, productImages, } = req.body;
        const campaign = await prisma_1.default.campaign.create({
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
    }
    catch (err) {
        next(err);
    }
};
exports.createCampaign = createCampaign;
const updateCampaign = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id },
            include: { advertiser: true },
        });
        if (!campaign)
            throw ApiError_1.ApiError.notFound('Không tìm thấy chiến dịch');
        if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') {
            throw ApiError_1.ApiError.forbidden();
        }
        const updated = await prisma_1.default.campaign.update({
            where: { id },
            data: {
                ...req.body,
                budgetTotal: req.body.budgetTotal ? parseFloat(req.body.budgetTotal) : undefined,
                budgetPerReviewer: req.body.budgetPerReviewer ? parseFloat(req.body.budgetPerReviewer) : undefined,
                deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
            },
        });
        res.json({ success: true, data: updated, message: 'Cập nhật chiến dịch thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.updateCampaign = updateCampaign;
const deleteCampaign = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id },
            include: { advertiser: true },
        });
        if (!campaign)
            throw ApiError_1.ApiError.notFound('Không tìm thấy chiến dịch');
        if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') {
            throw ApiError_1.ApiError.forbidden();
        }
        await prisma_1.default.campaign.update({
            where: { id },
            data: { status: client_1.CampaignStatus.CANCELLED },
        });
        res.json({ success: true, message: 'Hủy chiến dịch thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteCampaign = deleteCampaign;
const getMyAdvertiserCampaigns = async (req, res, next) => {
    try {
        const user = req.user;
        const { page = '1', limit = '10', status } = req.query;
        const advertiser = await prisma_1.default.advertiserProfile.findUnique({ where: { userId: user.id } });
        if (!advertiser)
            throw ApiError_1.ApiError.notFound('Hồ sơ doanh nghiệp không tồn tại');
        const where = { advertiserId: advertiser.id };
        if (status)
            where.status = status;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const [campaigns, total] = await Promise.all([
            prisma_1.default.campaign.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { applications: true } } },
            }),
            prisma_1.default.campaign.count({ where }),
        ]);
        res.json({
            success: true,
            data: campaigns,
            meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyAdvertiserCampaigns = getMyAdvertiserCampaigns;
const applyToCampaign = async (req, res, next) => {
    try {
        const user = req.user;
        const { id: campaignId } = req.params;
        const { note } = req.body;
        const reviewer = await prisma_1.default.reviewerProfile.findUnique({ where: { userId: user.id } });
        if (!reviewer)
            throw ApiError_1.ApiError.badRequest('Bạn cần hoàn thiện hồ sơ Reviewer trước');
        const campaign = await prisma_1.default.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign || campaign.status !== 'ACTIVE')
            throw ApiError_1.ApiError.notFound('Chiến dịch không tồn tại hoặc không còn hoạt động');
        const existing = await prisma_1.default.campaignApplication.findUnique({
            where: { campaignId_reviewerId: { campaignId, reviewerId: reviewer.id } },
        });
        if (existing)
            throw ApiError_1.ApiError.conflict('Bạn đã đăng ký tham gia chiến dịch này');
        const application = await prisma_1.default.campaignApplication.create({
            data: { campaignId, reviewerId: reviewer.id, note },
        });
        // Notify advertiser
        const io = req.app.get('io');
        const campaign2 = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (io && campaign2) {
            const { createNotification } = await Promise.resolve().then(() => __importStar(require('./notification.controller')));
            await createNotification(io, campaign2.advertiser.userId, {
                type: 'CAMPAIGN_INVITE',
                title: 'Reviewer mới đăng ký',
                message: `Có reviewer mới đăng ký chiến dịch "${campaign.title}"`,
                link: `/dashboard/campaigns/${campaignId}/applications`,
            });
        }
        res.status(201).json({ success: true, data: application, message: 'Đăng ký tham gia chiến dịch thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.applyToCampaign = applyToCampaign;
const getCampaignApplications = async (req, res, next) => {
    try {
        const user = req.user;
        const { id: campaignId } = req.params;
        const { status } = req.query;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (!campaign)
            throw ApiError_1.ApiError.notFound('Không tìm thấy chiến dịch');
        if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN')
            throw ApiError_1.ApiError.forbidden();
        const where = { campaignId };
        if (status)
            where.status = status;
        const applications = await prisma_1.default.campaignApplication.findMany({
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
    }
    catch (err) {
        next(err);
    }
};
exports.getCampaignApplications = getCampaignApplications;
const updateApplicationStatus = async (req, res, next) => {
    try {
        const user = req.user;
        const { id: campaignId, appId } = req.params;
        const { status, note } = req.body;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (!campaign || campaign.advertiser.userId !== user.id && user.role !== 'ADMIN')
            throw ApiError_1.ApiError.forbidden();
        const application = await prisma_1.default.campaignApplication.update({
            where: { id: appId },
            data: { status, note },
            include: { reviewer: true },
        });
        // Notify reviewer
        const io = req.app.get('io');
        if (io) {
            const { createNotification } = await Promise.resolve().then(() => __importStar(require('./notification.controller')));
            const notifType = status === 'APPROVED' ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED';
            await createNotification(io, application.reviewer.userId, {
                type: notifType,
                title: status === 'APPROVED' ? 'Đơn đăng ký được chấp thuận!' : 'Đơn đăng ký bị từ chối',
                message: `Chiến dịch: "${campaign.title}"`,
                link: `/reviewer/campaigns/${campaignId}`,
            });
        }
        res.json({ success: true, data: application, message: 'Cập nhật trạng thái thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getReviewerCampaigns = async (req, res, next) => {
    try {
        const user = req.user;
        const { status } = req.query;
        const reviewer = await prisma_1.default.reviewerProfile.findUnique({ where: { userId: user.id } });
        if (!reviewer)
            throw ApiError_1.ApiError.notFound('Hồ sơ Reviewer không tồn tại');
        const where = { reviewerId: reviewer.id };
        if (status)
            where.status = status;
        const applications = await prisma_1.default.campaignApplication.findMany({
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
    }
    catch (err) {
        next(err);
    }
};
exports.getReviewerCampaigns = getReviewerCampaigns;
//# sourceMappingURL=campaign.controller.js.map