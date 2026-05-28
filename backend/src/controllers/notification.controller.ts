import { Server } from 'socket.io';
import { Request, Response, NextFunction } from 'express';
import { User, NotificationType } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

interface CreateNotifOptions {
  type: string;
  title: string;
  message: string;
  link?: string;
}

export const createNotification = async (io: Server, userId: string, options: CreateNotifOptions) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: options.type as NotificationType,
      title: options.title,
      message: options.message,
      link: options.link,
    },
  });
  io.to(`user:${userId}`).emit('notification', notification);
  return notification;
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { page = '1', limit = '20', unreadOnly } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const where: any = { userId: user.id };
    if (unreadOnly === 'true') where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);

    res.json({
      success: true,
      data: notifications,
      meta: { total, page: pageNum, unreadCount, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id } = req.params;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { id, userId: user.id },
        data: { isRead: true },
      });
    }

    res.json({ success: true, message: 'Đã đánh dấu là đã đọc' });
  } catch (err) { next(err); }
};
