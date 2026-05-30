import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

interface User {
  id: string;
  role: string;
}

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { brandUserId: user.id },
          { reviewerUserId: user.id },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Enrich with user profiles
    const enriched = await Promise.all(conversations.map(async (conv) => {
      const reviewerUser = await prisma.user.findUnique({
        where: { id: conv.reviewerUserId },
        include: { profile: true, reviewerProfile: true },
      });
      const campaign = conv.campaignId
        ? await prisma.campaign.findUnique({ where: { id: conv.campaignId }, select: { title: true } })
        : null;

      const unread = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: user.id },
          isRead: false,
        },
      });

      return {
        ...conv,
        reviewer: {
          id: reviewerUser?.id,
          user: {
            profile: reviewerUser?.profile,
          },
        },
        campaign,
        lastMessage: conv.messages[0]?.content,
        unread,
      };
    }));

    res.json({ success: true, data: enriched });
  } catch (err) { next(err); }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) throw ApiError.notFound('Không tìm thấy cuộc trò chuyện');
    if (conversation.brandUserId !== user.id && conversation.reviewerUserId !== user.id) {
      throw ApiError.forbidden();
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) throw ApiError.badRequest('Nội dung tin nhắn không được trống');

    const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) throw ApiError.notFound('Không tìm thấy cuộc trò chuyện');
    if (conversation.brandUserId !== user.id && conversation.reviewerUserId !== user.id) {
      throw ApiError.forbidden();
    }

    const message = await prisma.message.create({
      data: { conversationId, senderId: user.id, content },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Emit via Socket.io
    const io = req.app.get('io');
    if (io) {
      const recipientId = conversation.brandUserId === user.id
        ? conversation.reviewerUserId
        : conversation.brandUserId;
      io.to(`user:${recipientId}`).emit('new_message', message);
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) { next(err); }
};

export const createOrGetConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { reviewerUserId, campaignId } = req.body;

    if (!reviewerUserId) throw ApiError.badRequest('reviewerUserId là bắt buộc');

    let conversation = await prisma.conversation.findFirst({
      where: {
        brandUserId: user.id,
        reviewerUserId,
        campaignId: campaignId || null,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          brandUserId: user.id,
          reviewerUserId,
          campaignId: campaignId || null,
        },
      });
    }

    res.json({ success: true, data: conversation });
  } catch (err) { next(err); }
};
