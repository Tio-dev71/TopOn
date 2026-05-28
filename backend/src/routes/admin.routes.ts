import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/toggle', adminController.toggleUserActive);
router.get('/withdrawals', adminController.getPendingWithdrawals);
router.put('/withdrawals/:id', adminController.processWithdrawal);

export default router;
