import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', role, search, isActive } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const where: any = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, role: true, isVerified: true, isActive: true,
          createdAt: true, profile: { select: { fullName: true, avatarUrl: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const toggleUserActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw ApiError.notFound('Người dùng không tồn tại');

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    res.json({ success: true, data: { isActive: updated.isActive }, message: updated.isActive ? 'Mở khóa tài khoản' : 'Khóa tài khoản' });
  } catch (err) { next(err); }
};

export const getPendingWithdrawals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        wallet: {
          include: {
            user: { select: { email: true, profile: { select: { fullName: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: withdrawals });
  } catch (err) { next(err); }
};

export const processWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { wallet: true },
    });
    if (!withdrawal) throw ApiError.notFound('Không tìm thấy yêu cầu rút tiền');

    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({
        where: { id },
        data: { status, adminNote, processedAt: new Date() },
      });

      if (status === 'FAILED') {
        // Refund
        await tx.wallet.update({
          where: { id: withdrawal.walletId },
          data: {
            balance: { increment: withdrawal.amount },
            lockedBalance: { decrement: withdrawal.amount },
          },
        });
        await tx.walletTransaction.create({
          data: {
            walletId: withdrawal.walletId,
            type: 'REFUND',
            amount: withdrawal.amount,
            balanceAfter: withdrawal.wallet.balance + withdrawal.amount,
            description: 'Hoàn tiền do yêu cầu rút thất bại',
            referenceId: id,
          },
        });
      } else if (status === 'DONE') {
        await tx.wallet.update({
          where: { id: withdrawal.walletId },
          data: { lockedBalance: { decrement: withdrawal.amount } },
        });
      }
    });

    res.json({ success: true, message: `Xử lý yêu cầu rút tiền thành công: ${status}` });
  } catch (err) { next(err); }
};

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalReviewers, totalAdvertisers, totalCampaigns, activeCampaigns, pendingWithdrawals] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'REVIEWER' } }),
        prisma.user.count({ where: { role: 'ADVERTISER' } }),
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: 'ACTIVE' } }),
        prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
      ]);

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, reviewers: totalReviewers, advertisers: totalAdvertisers },
        campaigns: { total: totalCampaigns, active: activeCampaigns },
        pendingWithdrawals,
      },
    });
  } catch (err) { next(err); }
};
