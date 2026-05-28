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
exports.uploadCompanyLogo = exports.updateAdvertiserProfile = exports.updateReviewerProfile = exports.getReviewerProfile = exports.uploadAvatar = exports.updateProfile = exports.getProfile = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const profile = await prisma_1.default.profile.findUnique({
            where: { userId: user.id },
        });
        res.json({ success: true, data: profile });
    }
    catch (err) {
        next(err);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { fullName, bio, phone, address, city, fields } = req.body;
        const profile = await prisma_1.default.profile.upsert({
            where: { userId: user.id },
            update: { fullName, bio, phone, address, city, fields },
            create: { userId: user.id, fullName, bio, phone, address, city, fields },
        });
        res.json({ success: true, data: profile, message: 'Cập nhật hồ sơ thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
const uploadAvatar = async (req, res, next) => {
    try {
        const user = req.user;
        if (!req.file)
            throw ApiError_1.ApiError.badRequest('Không tìm thấy file');
        const { uploadToCloudinary } = await Promise.resolve().then(() => __importStar(require('../utils/cloudinary')));
        const avatarUrl = await uploadToCloudinary(req.file.buffer, 'avatars');
        const profile = await prisma_1.default.profile.upsert({
            where: { userId: user.id },
            update: { avatarUrl },
            create: { userId: user.id, avatarUrl },
        });
        res.json({ success: true, data: { avatarUrl: profile.avatarUrl }, message: 'Cập nhật ảnh đại diện thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadAvatar = uploadAvatar;
const getReviewerProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewer = await prisma_1.default.reviewerProfile.findFirst({
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
        if (!reviewer)
            throw ApiError_1.ApiError.notFound('Không tìm thấy hồ sơ reviewer');
        res.json({ success: true, data: reviewer });
    }
    catch (err) {
        next(err);
    }
};
exports.getReviewerProfile = getReviewerProfile;
const updateReviewerProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { igHandle, tiktokHandle, ytHandle, fbHandle, followersIg, followersTiktok, followersYt, followersFb, engagementRate, specialties, } = req.body;
        const profile = await prisma_1.default.reviewerProfile.upsert({
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
    }
    catch (err) {
        next(err);
    }
};
exports.updateReviewerProfile = updateReviewerProfile;
const updateAdvertiserProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { companyName, website, description, industry, taxCode } = req.body;
        const profile = await prisma_1.default.advertiserProfile.upsert({
            where: { userId: user.id },
            update: { companyName, website, description, industry, taxCode },
            create: { userId: user.id, companyName, website, description, industry, taxCode },
        });
        res.json({ success: true, data: profile, message: 'Cập nhật hồ sơ doanh nghiệp thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.updateAdvertiserProfile = updateAdvertiserProfile;
const uploadCompanyLogo = async (req, res, next) => {
    try {
        const user = req.user;
        if (!req.file)
            throw ApiError_1.ApiError.badRequest('Không tìm thấy file');
        const { uploadToCloudinary } = await Promise.resolve().then(() => __importStar(require('../utils/cloudinary')));
        const logoUrl = await uploadToCloudinary(req.file.buffer, 'logos');
        const profile = await prisma_1.default.advertiserProfile.upsert({
            where: { userId: user.id },
            update: { logoUrl },
            create: { userId: user.id, logoUrl },
        });
        res.json({ success: true, data: { logoUrl: profile.logoUrl } });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadCompanyLogo = uploadCompanyLogo;
//# sourceMappingURL=profile.controller.js.map