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
exports.getBookmarks = exports.bookmarkReviewer = exports.inviteReviewer = exports.getReviewerDetail = exports.searchReviewers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const searchReviewers = async (req, res, next) => {
    try {
        const { page = '1', limit = '12', field, specialty, minFollowers, platform, location, search, sortBy = 'avgRating', order = 'desc', } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (specialty)
            where.specialties = { has: specialty };
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
            prisma_1.default.reviewerProfile.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [safeSort]: order },
                include: {
                    user: {
                        select: {
                            id: true, email: true, isVerified: true,
                            profile: { select: { fullName: true, avatarUrl: true, city: true, fields: true } },
                        },
                    },
                },
            }),
            prisma_1.default.reviewerProfile.count({ where }),
        ]);
        res.json({
            success: true,
            data: reviewers,
            meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.searchReviewers = searchReviewers;
const getReviewerDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewer = await prisma_1.default.reviewerProfile.findFirst({
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
        if (!reviewer)
            throw ApiError_1.ApiError.notFound('Không tìm thấy Reviewer');
        res.json({ success: true, data: reviewer });
    }
    catch (err) {
        next(err);
    }
};
exports.getReviewerDetail = getReviewerDetail;
const inviteReviewer = async (req, res, next) => {
    try {
        const user = req.user;
        const { id: reviewerUserId } = req.params;
        const { campaignId, message } = req.body;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (!campaign || campaign.advertiser.userId !== user.id)
            throw ApiError_1.ApiError.forbidden();
        const io = req.app.get('io');
        if (io) {
            const { createNotification } = await Promise.resolve().then(() => __importStar(require('./notification.controller')));
            await createNotification(io, reviewerUserId, {
                type: 'CAMPAIGN_INVITE',
                title: `📢 Bạn được mời tham gia chiến dịch!`,
                message: message || `Chiến dịch: "${campaign.title}"`,
                link: `/campaigns/${campaignId}`,
            });
        }
        res.json({ success: true, message: 'Đã gửi lời mời đến Reviewer' });
    }
    catch (err) {
        next(err);
    }
};
exports.inviteReviewer = inviteReviewer;
const bookmarkReviewer = async (req, res, next) => {
    try {
        const user = req.user;
        const { id: reviewerUserId } = req.params;
        const reviewer = await prisma_1.default.reviewerProfile.findFirst({ where: { userId: reviewerUserId } });
        if (!reviewer)
            throw ApiError_1.ApiError.notFound('Reviewer không tồn tại');
        const existing = await prisma_1.default.bookmark.findUnique({
            where: { advertiserId_reviewerId: { advertiserId: user.id, reviewerId: reviewer.id } },
        });
        if (existing) {
            await prisma_1.default.bookmark.delete({ where: { id: existing.id } });
            return res.json({ success: true, bookmarked: false, message: 'Đã xóa bookmark' });
        }
        await prisma_1.default.bookmark.create({ data: { advertiserId: user.id, reviewerId: reviewer.id } });
        res.json({ success: true, bookmarked: true, message: 'Đã bookmark Reviewer' });
    }
    catch (err) {
        next(err);
    }
};
exports.bookmarkReviewer = bookmarkReviewer;
const getBookmarks = async (req, res, next) => {
    try {
        const user = req.user;
        const bookmarks = await prisma_1.default.bookmark.findMany({
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
    }
    catch (err) {
        next(err);
    }
};
exports.getBookmarks = getBookmarks;
//# sourceMappingURL=reviewer.controller.js.map