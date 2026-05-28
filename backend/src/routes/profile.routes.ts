import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../utils/cloudinary';
import * as profileController from '../controllers/profile.controller';

const router = Router();

router.get('/me', authenticate, profileController.getProfile);
router.put('/me', authenticate, profileController.updateProfile);
router.post('/me/avatar', authenticate, upload.single('avatar'), profileController.uploadAvatar);

// Reviewer profile
router.get('/reviewer/:id', profileController.getReviewerProfile);
router.put('/reviewer', authenticate, authorize('REVIEWER'), profileController.updateReviewerProfile);

// Advertiser profile
router.put('/advertiser', authenticate, authorize('ADVERTISER'), profileController.updateAdvertiserProfile);
router.post('/advertiser/logo', authenticate, authorize('ADVERTISER'), upload.single('logo'), profileController.uploadCompanyLogo);

export default router;
