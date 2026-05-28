import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as campaignController from '../controllers/campaign.controller';

const router = Router();

// Public
router.get('/', campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Reviewer
router.get('/my/applied', authenticate, authorize('REVIEWER'), campaignController.getReviewerCampaigns);
router.post('/:id/apply', authenticate, authorize('REVIEWER'), campaignController.applyToCampaign);

// Advertiser
router.get('/my/created', authenticate, authorize('ADVERTISER'), campaignController.getMyAdvertiserCampaigns);
router.post('/', authenticate, authorize('ADVERTISER'), campaignController.createCampaign);
router.put('/:id', authenticate, campaignController.updateCampaign);
router.delete('/:id', authenticate, campaignController.deleteCampaign);
router.get('/:id/applications', authenticate, campaignController.getCampaignApplications);
router.put('/:id/applications/:appId', authenticate, campaignController.updateApplicationStatus);

export default router;
