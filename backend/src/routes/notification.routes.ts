import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as notifController from '../controllers/notification.controller';

const router = Router();

router.get('/', authenticate, notifController.getNotifications);
router.put('/:id/read', authenticate, notifController.markAsRead);

export default router;
