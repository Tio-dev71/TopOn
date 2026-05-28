"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRatings = exports.createRating = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const createRating = async (req, res, next) => {
    try {
        const user = req.user;
        const { toUserId, campaignId, stars, comment } = req.body;
        if (user.id === toUserId)
            throw ApiError_1.ApiError.badRequest('Không thể tự đánh giá bản thân');
        if (stars < 1 || stars > 5)
            throw ApiError_1.ApiError.badRequest('Rating phải từ 1-5 sao');
        const existing = await prisma_1.default.rating.findUnique({
            where: { fromUserId_toUserId_campaignId: { fromUserId: user.id, toUserId, campaignId: campaignId || '' } },
        });
        if (existing)
            throw ApiError_1.ApiError.conflict('Bạn đã đánh giá người dùng này cho chiến dịch này');
        const rating = await prisma_1.default.rating.create({
            data: { fromUserId: user.id, toUserId, campaignId, stars, comment },
        });
        // Recalculate avg rating
        const ratings = await prisma_1.default.rating.findMany({ where: { toUserId } });
        const avgRating = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
        // Update reviewer or advertiser profile
        const targetUser = await prisma_1.default.user.findUnique({ where: { id: toUserId } });
        if (targetUser?.role === 'REVIEWER') {
            await prisma_1.default.reviewerProfile.updateMany({
                where: { userId: toUserId },
                data: { avgRating },
            });
        }
        else if (targetUser?.role === 'ADVERTISER') {
            await prisma_1.default.advertiserProfile.updateMany({
                where: { userId: toUserId },
                data: { avgRating },
            });
        }
        res.status(201).json({ success: true, data: rating, message: 'Đánh giá thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.createRating = createRating;
const getUserRatings = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const ratings = await prisma_1.default.rating.findMany({
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
    }
    catch (err) {
        next(err);
    }
};
exports.getUserRatings = getUserRatings;
//# sourceMappingURL=rating.controller.js.map