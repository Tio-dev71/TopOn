"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getTipsGuides = exports.getBlogBySlug = exports.getBlogs = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const getBlogs = async (req, res, next) => {
    try {
        const { page = '1', limit = '9', category } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const where = { isPublished: true };
        if (category)
            where.category = category;
        const [blogs, total] = await Promise.all([
            prisma_1.default.blogPost.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { publishedAt: 'desc' },
                select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, category: true, author: true, publishedAt: true },
            }),
            prisma_1.default.blogPost.count({ where }),
        ]);
        res.json({
            success: true,
            data: blogs,
            meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getBlogs = getBlogs;
const getBlogBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const blog = await prisma_1.default.blogPost.findUnique({ where: { slug, isPublished: true } });
        if (!blog)
            throw ApiError_1.ApiError.notFound('Không tìm thấy bài viết');
        res.json({ success: true, data: blog });
    }
    catch (err) {
        next(err);
    }
};
exports.getBlogBySlug = getBlogBySlug;
const getTipsGuides = async (req, res, next) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category)
            where.category = category;
        const tips = await prisma_1.default.tipsGuide.findMany({
            where,
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        });
        res.json({ success: true, data: tips });
    }
    catch (err) {
        next(err);
    }
};
exports.getTipsGuides = getTipsGuides;
// Admin: CRUD for blogs
const createBlog = async (req, res, next) => {
    try {
        const { title, slug, excerpt, content, coverUrl, category, author, isPublished } = req.body;
        const blog = await prisma_1.default.blogPost.create({
            data: {
                title, slug, excerpt, content, coverUrl, category, author,
                isPublished: isPublished || false,
                publishedAt: isPublished ? new Date() : null,
            },
        });
        res.status(201).json({ success: true, data: blog });
    }
    catch (err) {
        next(err);
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.isPublished && !data.publishedAt)
            data.publishedAt = new Date();
        const blog = await prisma_1.default.blogPost.update({ where: { id }, data });
        res.json({ success: true, data: blog });
    }
    catch (err) {
        next(err);
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.default.blogPost.delete({ where: { id } });
        res.json({ success: true, message: 'Xóa bài viết thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blog.controller.js.map