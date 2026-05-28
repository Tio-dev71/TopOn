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
exports.getMyContents = exports.updateContentStatus = exports.getCampaignContents = exports.submitContent = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const cloudinary_1 = require("../utils/cloudinary");
const submitContent = async (req, res, next) => {
    try {
        const user = req.user;
        const { applicationId, caption, link, contentType = 'IMAGE' } = req.body;
        // Verify ownership
        const application = await prisma_1.default.campaignApplication.findUnique({
            where: { id: applicationId },
            include: { reviewer: true, campaign: true },
        });
        if (!application)
            throw ApiError_1.ApiError.notFound('Đơn đăng ký không tồn tại');
        if (application.reviewer.userId !== user.id)
            throw ApiError_1.ApiError.forbidden();
        if (application.status !== 'APPROVED')
            throw ApiError_1.ApiError.badRequest('Đơn đăng ký chưa được duyệt');
        // Upload files
        const files = req.files;
        const contentUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
                const url = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'contents', resourceType);
                contentUrls.push(url);
            }
        }
        const content = await prisma_1.default.campaignContent.create({
            data: {
                applicationId,
                contentUrls,
                contentType: contentType,
                caption,
                link,
            },
        });
        // Notify advertiser
        const io = req.app.get('io');
        if (io) {
            const { createNotification } = await Promise.resolve().then(() => __importStar(require('./notification.controller')));
            await createNotification(io, application.campaign.advertiserId, {
                type: 'CONTENT_APPROVED',
                title: 'Reviewer đã nộp nội dung',
                message: `Chiến dịch: "${application.campaign.title}"`,
                link: `/dashboard/campaigns/${application.campaignId}/contents`,
            });
        }
        res.status(201).json({ success: true, data: content, message: 'Nộp nội dung thành công, đang chờ duyệt' });
    }
    catch (err) {
        next(err);
    }
};
exports.submitContent = submitContent;
const getCampaignContents = async (req, res, next) => {
    try {
        const user = req.user;
        const { campaignId } = req.params;
        const { status } = req.query;
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (!campaign)
            throw ApiError_1.ApiError.notFound('Không tìm thấy chiến dịch');
        if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN')
            throw ApiError_1.ApiError.forbidden();
        const where = {
            application: { campaignId },
        };
        if (status)
            where.status = status;
        const contents = await prisma_1.default.campaignContent.findMany({
            where,
            include: {
                application: {
                    include: {
                        reviewer: { include: { user: { include: { profile: true } } } },
                    },
                },
                approvalLogs: { orderBy: { createdAt: 'desc' } },
            },
            orderBy: { submittedAt: 'desc' },
        });
        res.json({ success: true, data: contents });
    }
    catch (err) {
        next(err);
    }
};
exports.getCampaignContents = getCampaignContents;
const updateContentStatus = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { status, reviewNotes } = req.body;
        const content = await prisma_1.default.campaignContent.findUnique({
            where: { id },
            include: {
                application: {
                    include: {
                        campaign: { include: { advertiser: true } },
                        reviewer: true,
                    },
                },
            },
        });
        if (!content)
            throw ApiError_1.ApiError.notFound('Không tìm thấy nội dung');
        const { campaign } = content.application;
        if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN')
            throw ApiError_1.ApiError.forbidden();
        const updated = await prisma_1.default.campaignContent.update({
            where: { id },
            data: {
                status: status,
                reviewNotes,
                reviewedAt: new Date(),
                approvalLogs: {
                    create: {
                        action: status,
                        note: reviewNotes,
                        by: user.id,
                    },
                },
            },
        });
        // Notify reviewer
        const io = req.app.get('io');
        if (io) {
            const { createNotification } = await Promise.resolve().then(() => __importStar(require('./notification.controller')));
            const notifType = status === 'APPROVED' ? 'CONTENT_APPROVED' :
                status === 'REJECTED' ? 'CONTENT_REJECTED' : 'CONTENT_CHANGES_REQUESTED';
            await createNotification(io, content.application.reviewer.userId, {
                type: notifType,
                title: status === 'APPROVED' ? '✅ Nội dung được duyệt!' :
                    status === 'REJECTED' ? '❌ Nội dung bị từ chối' : '📝 Yêu cầu chỉnh sửa nội dung',
                message: reviewNotes || `Chiến dịch: "${campaign.title}"`,
                link: `/reviewer/campaigns/${campaign.id}`,
            });
            // If approved, credit reviewer
            if (status === 'APPROVED') {
                const reviewerWallet = await prisma_1.default.wallet.findUnique({
                    where: { userId: content.application.reviewer.userId },
                });
                if (reviewerWallet) {
                    const payment = campaign.budgetPerReviewer;
                    await prisma_1.default.wallet.update({
                        where: { id: reviewerWallet.id },
                        data: { balance: { increment: payment } },
                    });
                    await prisma_1.default.walletTransaction.create({
                        data: {
                            walletId: reviewerWallet.id,
                            type: 'SYSTEM',
                            amount: payment,
                            balanceAfter: reviewerWallet.balance + payment,
                            description: `Thanh toán chiến dịch: ${campaign.title}`,
                            referenceId: content.id,
                        },
                    });
                }
            }
        }
        res.json({ success: true, data: updated, message: 'Cập nhật trạng thái nội dung thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.updateContentStatus = updateContentStatus;
const getMyContents = async (req, res, next) => {
    try {
        const user = req.user;
        const { status } = req.query;
        const reviewer = await prisma_1.default.reviewerProfile.findUnique({ where: { userId: user.id } });
        if (!reviewer)
            throw ApiError_1.ApiError.notFound('Hồ sơ Reviewer không tồn tại');
        const where = {
            application: { reviewer: { userId: user.id } },
        };
        if (status)
            where.status = status;
        const contents = await prisma_1.default.campaignContent.findMany({
            where,
            include: {
                application: {
                    include: {
                        campaign: { select: { id: true, title: true, coverUrl: true } },
                    },
                },
                approvalLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            orderBy: { submittedAt: 'desc' },
        });
        res.json({ success: true, data: contents });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyContents = getMyContents;
//# sourceMappingURL=content.controller.js.map