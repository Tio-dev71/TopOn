import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.get('/wallet', authenticate, paymentController.getWallet);
router.post('/topup', authenticate, paymentController.topUpWallet);
router.post('/assign', authenticate, paymentController.assignBudget);
router.get('/transactions', authenticate, paymentController.getTransactionHistory);
router.post('/withdraw', authenticate, paymentController.requestWithdrawal);
router.get('/withdraw/history', authenticate, paymentController.getWithdrawalHistory);

export default router;
