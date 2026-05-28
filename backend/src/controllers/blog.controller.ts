import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '9', category, all } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const where: any = {};
    if (all !== 'true') where.isPublished = true;
    if (category) where.category = category;

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, slug: true, excerpt: true, content: true, coverUrl: true, category: true, author: true, publishedAt: true, isPublished: true },
      }),
      prisma.blogPost.count({ where }),
    ]);

    res.json({
      success: true,
      data: blogs,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const blog = await prisma.blogPost.findUnique({ where: { slug, isPublished: true } });
    if (!blog) throw ApiError.notFound('Không tìm thấy bài viết');
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

export const getTipsGuides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query as Record<string, string>;
    const where: any = {};
    if (category) where.category = category;

    const tips = await prisma.tipsGuide.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    res.json({ success: true, data: tips });
  } catch (err) { next(err); }
};

// Admin: CRUD for blogs
export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, slug, excerpt, content, coverUrl, category, author, isPublished } = req.body;
    const blog = await prisma.blogPost.create({
      data: {
        title, slug, excerpt, content, coverUrl, category, author,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    res.status(201).json({ success: true, data: blog });
  } catch (err) { next(err); }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
    const blog = await prisma.blogPost.update({ where: { id }, data });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.blogPost.delete({ where: { id } });
    res.json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (err) { next(err); }
};
