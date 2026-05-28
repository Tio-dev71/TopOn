"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPass, admin, advPass, advertiser, revPass, reviewer, advProfile, campaigns, _i, campaigns_1, campaign;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    return [4 /*yield*/, bcryptjs_1.default.hash('Admin@123456', 12)];
                case 1:
                    adminPass = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@topon.vn' },
                            update: {},
                            create: {
                                email: 'admin@topon.vn',
                                passwordHash: adminPass,
                                role: 'ADMIN',
                                isVerified: true,
                                profile: { create: { fullName: 'TopOn Admin', avatarUrl: null } },
                                wallet: { create: {} },
                            },
                        })];
                case 2:
                    admin = _a.sent();
                    console.log('✅ Admin created:', admin.email);
                    return [4 /*yield*/, bcryptjs_1.default.hash('Test@123456', 12)];
                case 3:
                    advPass = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'brand@demo.vn' },
                            update: {},
                            create: {
                                email: 'brand@demo.vn',
                                passwordHash: advPass,
                                role: 'ADVERTISER',
                                isVerified: true,
                                profile: { create: { fullName: 'Demo Brand' } },
                                advertiserProfile: {
                                    create: {
                                        companyName: 'Demo Brand Vietnam',
                                        website: 'https://demo.vn',
                                        description: 'Thương hiệu làm đẹp hàng đầu Việt Nam',
                                        industry: 'Làm đẹp',
                                    },
                                },
                                wallet: { create: { balance: 50000000 } },
                            },
                        })];
                case 4:
                    advertiser = _a.sent();
                    console.log('✅ Advertiser created:', advertiser.email);
                    return [4 /*yield*/, bcryptjs_1.default.hash('Test@123456', 12)];
                case 5:
                    revPass = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'reviewer@demo.vn' },
                            update: {},
                            create: {
                                email: 'reviewer@demo.vn',
                                passwordHash: revPass,
                                role: 'REVIEWER',
                                isVerified: true,
                                profile: { create: { fullName: 'Nguyễn Thị Review', city: 'Hồ Chí Minh', fields: ['Làm đẹp', 'Lifestyle'] } },
                                reviewerProfile: {
                                    create: {
                                        igHandle: '@nguyenreview',
                                        tiktokHandle: '@nguyenreview_tiktok',
                                        followersIg: 25000,
                                        followersTiktok: 80000,
                                        engagementRate: 4.5,
                                        specialties: ['Làm đẹp', 'Skincare', 'Review'],
                                        avgRating: 4.8,
                                        totalCampaigns: 23,
                                    },
                                },
                                wallet: { create: { balance: 5000000 } },
                            },
                        })];
                case 6:
                    reviewer = _a.sent();
                    console.log('✅ Reviewer created:', reviewer.email);
                    return [4 /*yield*/, prisma.advertiserProfile.findUnique({ where: { userId: advertiser.id } })];
                case 7:
                    advProfile = _a.sent();
                    if (!advProfile) return [3 /*break*/, 12];
                    campaigns = [
                        {
                            title: 'Review Serum dưỡng sáng mùa hè',
                            description: 'Tìm kiếm reviewer đánh giá sản phẩm serum dưỡng ẩm mới nhất. Cần nội dung chân thực và sáng tạo.',
                            type: 'REVIEW',
                            budgetTotal: 20000000,
                            budgetPerReviewer: 1500000,
                            maxReviewers: 15,
                            deadline: new Date('2025-06-30'),
                            platforms: ['INSTAGRAM', 'TIKTOK'],
                            categories: ['Làm đẹp', 'Skincare'],
                            status: 'ACTIVE',
                            isFeatured: true,
                        },
                        {
                            title: 'Check-in resort nghỉ dưỡng cao cấp',
                            description: 'Trải nghiệm và đánh giá resort 5 sao tại Phú Quốc. Nội dung ảnh + video chất lượng cao.',
                            type: 'CHECKIN',
                            budgetTotal: 30000000,
                            budgetPerReviewer: 10000000,
                            maxReviewers: 3,
                            deadline: new Date('2025-07-15'),
                            platforms: ['INSTAGRAM', 'YOUTUBE'],
                            categories: ['Du lịch', 'Lifestyle'],
                            status: 'ACTIVE',
                            isFeatured: true,
                        },
                        {
                            title: 'Nồi chiên không dầu đa năng',
                            description: 'Review sản phẩm nồi chiên không dầu mới nhất. Ưu tiên reviewer chuyên về đồ gia dụng, nấu ăn.',
                            type: 'REVIEW',
                            budgetTotal: 15000000,
                            budgetPerReviewer: 2000000,
                            maxReviewers: 8,
                            deadline: new Date('2025-06-20'),
                            platforms: ['TIKTOK', 'YOUTUBE'],
                            categories: ['Nhà bếp', 'Đồ gia dụng'],
                            status: 'ACTIVE',
                            isFeatured: false,
                        },
                    ];
                    _i = 0, campaigns_1 = campaigns;
                    _a.label = 8;
                case 8:
                    if (!(_i < campaigns_1.length)) return [3 /*break*/, 11];
                    campaign = campaigns_1[_i];
                    return [4 /*yield*/, prisma.campaign.create({
                            data: __assign(__assign({}, campaign), { advertiserId: advProfile.id }),
                        })];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log('✅ Sample campaigns created');
                    _a.label = 12;
                case 12: 
                // Create blog posts
                return [4 /*yield*/, prisma.blogPost.createMany({
                        data: [
                            {
                                title: 'Top 5 Influencer Marketing 2025 cho review TikTok',
                                slug: 'top-5-influencer-marketing-2025-tiktok',
                                excerpt: 'Khám phá những xu hướng influencer marketing hot nhất năm 2025 trên TikTok.',
                                content: '<p>Nội dung bài viết...</p>',
                                category: 'Chiến lược',
                                author: 'TopOn Team',
                                isPublished: true,
                                publishedAt: new Date(),
                                coverUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
                            },
                            {
                                title: 'Bí quyết tăng engagement cho reviewer TikTok',
                                slug: 'bi-quyet-tang-engagement-tiktok-reviewer',
                                excerpt: 'Học cách tăng tỷ lệ tương tác và thu hút thương hiệu trên TikTok.',
                                content: '<p>Nội dung bài viết...</p>',
                                category: 'Hướng dẫn',
                                author: 'TopOn Team',
                                isPublished: true,
                                publishedAt: new Date(),
                                coverUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800',
                            },
                        ],
                        skipDuplicates: true,
                    })];
                case 13:
                    // Create blog posts
                    _a.sent();
                    console.log('✅ Blog posts seeded');
                    // Create tips
                    return [4 /*yield*/, prisma.tipsGuide.createMany({
                            data: [
                                { title: 'Cách viết caption hấp dẫn', content: '...', category: 'Nội dung', order: 1 },
                                { title: 'Tối ưu hashtag TikTok', content: '...', category: 'TikTok', order: 1 },
                                { title: 'Chụp ảnh sản phẩm chuyên nghiệp', content: '...', category: 'Nhiếp ảnh', order: 1 },
                                { title: 'Cách đàm phán giá với brand', content: '...', category: 'Kinh doanh', order: 1 },
                            ],
                            skipDuplicates: true,
                        })];
                case 14:
                    // Create tips
                    _a.sent();
                    console.log('✅ Tips seeded');
                    console.log('\n🎉 Seed completed!');
                    console.log('📧 Admin: admin@topon.vn / Admin@123456');
                    console.log('📧 Advertiser: brand@demo.vn / Test@123456');
                    console.log('📧 Reviewer: reviewer@demo.vn / Test@123456');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });
