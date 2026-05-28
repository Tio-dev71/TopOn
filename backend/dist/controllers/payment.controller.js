"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWithdrawalHistory = exports.requestWithdrawal = exports.getTransactionHistory = exports.assignBudget = exports.topUpWallet = exports.getWallet = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiError_1 = require("../utils/ApiError");
const getWallet = async (req, res, next) => {
    try {
        const user = req.user;
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { userId: user.id },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
        if (!wallet)
            throw ApiError_1.ApiError.notFound('Ví không tồn tại');
        res.json({ success: true, data: wallet });
    }
    catch (err) {
        next(err);
    }
};
exports.getWallet = getWallet;
const topUpWallet = async (req, res, next) => {
    try {
        const user = req.user;
        const { amount, method = 'VNPAY', transactionRef } = req.body;
        if (!amount || parseFloat(amount) <= 0)
            throw ApiError_1.ApiError.badRequest('Số tiền không hợp lệ');
        const wallet = await prisma_1.default.wallet.findUnique({ where: { userId: user.id } });
        if (!wallet)
            throw ApiError_1.ApiError.notFound('Ví không tồn tại');
        const amountNum = parseFloat(amount);
        const newBalance = wallet.balance + amountNum;
        await prisma_1.default.$transaction([
            prisma_1.default.wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance },
            }),
            prisma_1.default.walletTransaction.create({
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
    }
    catch (err) {
        next(err);
    }
};
exports.topUpWallet = topUpWallet;
const assignBudget = async (req, res, next) => {
    try {
        const user = req.user;
        const { campaignId, amount } = req.body;
        const wallet = await prisma_1.default.wallet.findUnique({ where: { userId: user.id } });
        if (!wallet)
            throw ApiError_1.ApiError.notFound('Ví không tồn tại');
        const amountNum = parseFloat(amount);
        if (wallet.balance < amountNum)
            throw ApiError_1.ApiError.badRequest('Số dư không đủ');
        const campaign = await prisma_1.default.campaign.findUnique({
            where: { id: campaignId },
            include: { advertiser: true },
        });
        if (!campaign || campaign.advertiser.userId !== user.id)
            throw ApiError_1.ApiError.forbidden();
        await prisma_1.default.$transaction([
            prisma_1.default.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: wallet.balance - amountNum,
                    lockedBalance: wallet.lockedBalance + amountNum,
                },
            }),
            prisma_1.default.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'ASSIGN',
                    amount: -amountNum,
                    balanceAfter: wallet.balance - amountNum,
                    referenceId: campaignId,
                    description: `Phân bổ ngân sách cho chiến dịch: ${campaign.title}`,
                },
            }),
            prisma_1.default.budgetAllocation.create({
                data: { campaignId, allocatedAmt: amountNum },
            }),
        ]);
        res.json({ success: true, message: 'Phân bổ ngân sách thành công' });
    }
    catch (err) {
        next(err);
    }
};
exports.assignBudget = assignBudget;
const getTransactionHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const { page = '1', limit = '20', type } = req.query;
        const wallet = await prisma_1.default.wallet.findUnique({ where: { userId: user.id } });
        if (!wallet)
            throw ApiError_1.ApiError.notFound('Ví không tồn tại');
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const where = { walletId: wallet.id };
        if (type)
            where.type = type;
        const [transactions, total] = await Promise.all([
            prisma_1.default.walletTransaction.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.default.walletTransaction.count({ where }),
        ]);
        res.json({
            success: true,
            data: transactions,
            meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getTransactionHistory = getTransactionHistory;
const requestWithdrawal = async (req, res, next) => {
    try {
        const user = req.user;
        const { amount, bankName, accountNumber, accountName, paypalEmail } = req.body;
        const wallet = await prisma_1.default.wallet.findUnique({ where: { userId: user.id } });
        if (!wallet)
            throw ApiError_1.ApiError.notFound('Ví không tồn tại');
        const amountNum = parseFloat(amount);
        if (wallet.balance < amountNum)
            throw ApiError_1.ApiError.badRequest('Số dư không đủ để rút');
        if (amountNum < 100000)
            throw ApiError_1.ApiError.badRequest('Số tiền rút tối thiểu là 100,000 VND');
        const withdrawal = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (err) {
        next(err);
    }
};
exports.requestWithdrawal = requestWithdrawal;
const getWithdrawalHistory = async (req, res, next) => {
    try {
        const user = req.user;
        const wallet = await prisma_1.default.wallet.findUnique({ where: { userId: user.id } });
        if (!wallet)
            throw ApiError_1.ApiError.notFound('Ví không tồn tại');
        const withdrawals = await prisma_1.default.withdrawalRequest.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: withdrawals });
    }
    catch (err) {
        next(err);
    }
};
exports.getWithdrawalHistory = getWithdrawalHistory;
//# sourceMappingURL=payment.controller.js.map