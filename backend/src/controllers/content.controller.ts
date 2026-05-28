import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { uploadToCloudinary } from '../utils/cloudinary';

export const submitContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { applicationId, caption, link, contentType = 'IMAGE' } = req.body;

    // Verify ownership
    const application = await prisma.campaignApplication.findUnique({
      where: { id: applicationId },
      include: { reviewer: true, campaign: true },
    });
    if (!application) throw ApiError.notFound('Đơn đăng ký không tồn tại');
    if (application.reviewer.userId !== user.id) throw ApiError.forbidden();
    if (application.status !== 'APPROVED') throw ApiError.badRequest('Đơn đăng ký chưa được duyệt');

    // Upload files
    const files = req.files as Express.Multer.File[];
    const contentUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
        const url = await uploadToCloudinary(file.buffer, 'contents', resourceType);
        contentUrls.push(url);
      }
    }

    const content = await prisma.campaignContent.create({
      data: {
        applicationId,
        contentUrls,
        contentType: contentType as any,
        caption,
        link,
      },
    });

    // Notify advertiser
    const io = req.app.get('io');
    if (io) {
      const { createNotification } = await import('./notification.controller');
      await createNotification(io, application.campaign.advertiserId, {
        type: 'CONTENT_APPROVED',
        title: 'Reviewer đã nộp nội dung',
        message: `Chiến dịch: "${application.campaign.title}"`,
        link: `/dashboard/campaigns/${application.campaignId}/contents`,
      });
    }

    res.status(201).json({ success: true, data: content, message: 'Nộp nội dung thành công, đang chờ duyệt' });
  } catch (err) { next(err); }
};

export const getCampaignContents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { campaignId } = req.params;
    const { status } = req.query as Record<string, string>;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (!campaign) throw ApiError.notFound('Không tìm thấy chiến dịch');
    if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') throw ApiError.forbidden();

    const where: any = {
      application: { campaignId },
    };
    if (status) where.status = status;

    const contents = await prisma.campaignContent.findMany({
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
  } catch (err) { next(err); }
};

export const updateContentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const content = await prisma.campaignContent.findUnique({
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

    if (!content) throw ApiError.notFound('Không tìm thấy nội dung');
    const { campaign } = content.application;

    if (campaign.advertiser.userId !== user.id && user.role !== 'ADMIN') throw ApiError.forbidden();

    const updated = await prisma.campaignContent.update({
      where: { id },
      data: {
        status: status as any,
        reviewNotes,
        reviewedAt: new Date(),
        approvalLogs: {
          create: {
            action: status as any,
            note: reviewNotes,
            by: user.id,
          },
        },
      },
    });

    // Notify reviewer
    const io = req.app.get('io');
    if (io) {
      const { createNotification } = await import('./notification.controller');
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
        const reviewerWallet = await prisma.wallet.findUnique({
          where: { userId: content.application.reviewer.userId },
        });
        if (reviewerWallet) {
          const payment = campaign.budgetPerReviewer;
          await prisma.wallet.update({
            where: { id: reviewerWallet.id },
            data: { balance: { increment: payment } },
          });
          await prisma.walletTransaction.create({
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
  } catch (err) { next(err); }
};

export const getMyContents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { status } = req.query as Record<string, string>;

    const reviewer = await prisma.reviewerProfile.findUnique({ where: { userId: user.id } });
    if (!reviewer) throw ApiError.notFound('Hồ sơ Reviewer không tồn tại');

    const where: any = {
      application: { reviewer: { userId: user.id } },
    };
    if (status) where.status = status;

    const contents = await prisma.campaignContent.findMany({
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
  } catch (err) { next(err); }
};
