"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createNotification = async (io, userId, options) => {
    const notification = await prisma_1.default.notification.create({
        data: {
            userId,
            type: options.type,
            title: options.title,
            message: options.message,
            link: options.link,
        },
    });
    io.to(`user:${userId}`).emit('notification', notification);
    return notification;
};
exports.createNotification = createNotification;
const getNotifications = async (req, res, next) => {
    try {
        const user = req.user;
        const { page = '1', limit = '20', unreadOnly } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const where = { userId: user.id };
        if (unreadOnly === 'true')
            where.isRead = false;
        const [notifications, total, unreadCount] = await Promise.all([
            prisma_1.default.notification.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.default.notification.count({ where }),
            prisma_1.default.notification.count({ where: { userId: user.id, isRead: false } }),
        ]);
        res.json({
            success: true,
            data: notifications,
            meta: { total, page: pageNum, unreadCount, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        if (id === 'all') {
            await prisma_1.default.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true },
            });
        }
        else {
            await prisma_1.default.notification.updateMany({
                where: { id, userId: user.id },
                data: { isRead: true },
            });
        }
        res.json({ success: true, message: 'Đã đánh dấu là đã đọc' });
    }
    catch (err) {
        next(err);
    }
};
exports.markAsRead = markAsRead;
//# sourceMappingURL=notification.controller.js.map