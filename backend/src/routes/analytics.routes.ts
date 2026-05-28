import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

router.get('/campaign/:id', authenticate, analyticsController.getCampaignAnalytics);
router.get('/advertiser/overview', authenticate, analyticsController.getAdvertiserOverview);
router.get('/reviewer/overview', authenticate, analyticsController.getReviewerOverview);

export default router;
