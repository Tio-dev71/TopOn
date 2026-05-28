import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!wallet) throw ApiError.notFound('Ví không tồn tại');
    res.json({ success: true, data: wallet });
  } catch (err) { next(err); }
};

export const topUpWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { amount, method = 'VNPAY', transactionRef } = req.body;

    if (!amount || parseFloat(amount) <= 0) throw ApiError.badRequest('Số tiền không hợp lệ');

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) throw ApiError.notFound('Ví không tồn tại');

    const amountNum = parseFloat(amount);
    const newBalance = wallet.balance + amountNum;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'TOPUP',
          amount: amountNum,
          balanceAfter: newBalance,
          referenceId: transactionRef,
          description: `Nạp tiền qua ${method}`,
          meta: { method },
        },
      }),
    ]);

    res.json({ success: true, message: `Nạp ${amountNum.toLocaleString('vi-VN')} VND thành công`, data: { balance: newBalance } });
  } catch (err) { next(err); }
};

export const assignBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { campaignId, amount } = req.body;

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) throw ApiError.notFound('Ví không tồn tại');

    const amountNum = parseFloat(amount);
    if (wallet.balance < amountNum) throw ApiError.badRequest('Số dư không đủ');

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { advertiser: true },
    });
    if (!campaign || campaign.advertiser.userId !== user.id) throw ApiError.forbidden();

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance - amountNum,
          lockedBalance: wallet.lockedBalance + amountNum,
        },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'ASSIGN',
          amount: -amountNum,
          balanceAfter: wallet.balance - amountNum,
          referenceId: campaignId,
          description: `Phân bổ ngân sách cho chiến dịch: ${campaign.title}`,
        },
      }),
      prisma.budgetAllocation.create({
        data: { campaignId, allocatedAmt: amountNum },
      }),
    ]);

    res.json({ success: true, message: 'Phân bổ ngân sách thành công' });
  } catch (err) { next(err); }
};

export const getTransactionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { page = '1', limit = '20', type } = req.query as Record<string, string>;

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) throw ApiError.notFound('Ví không tồn tại');

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const where: any = { walletId: wallet.id };
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.walletTransaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: transactions,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

export const requestWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { amount, bankName, accountNumber, accountName, paypalEmail } = req.body;

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) throw ApiError.notFound('Ví không tồn tại');

    const amountNum = parseFloat(amount);
    if (wallet.balance < amountNum) throw ApiError.badRequest('Số dư không đủ để rút');
    if (amountNum < 100000) throw ApiError.badRequest('Số tiền rút tối thiểu là 100,000 VND');

    const withdrawal = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance - amountNum,
          lockedBalance: wallet.lockedBalance + amountNum,
        },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAW',
          amount: -amountNum,
          balanceAfter: wallet.balance - amountNum,
          description: `Yêu cầu rút tiền: ${amountNum.toLocaleString('vi-VN')} VND`,
        },
      });
      return tx.withdrawalRequest.create({
        data: {
          walletId: wallet.id,
          amount: amountNum,
          bankName, accountNumber, accountName, paypalEmail,
        },
      });
    });

    res.status(201).json({ success: true, data: withdrawal, message: 'Yêu cầu rút tiền đã được gửi, đang xử lý' });
  } catch (err) { next(err); }
};

export const getWithdrawalHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) throw ApiError.notFound('Ví không tồn tại');

    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: withdrawals });
  } catch (err) { next(err); }
};
