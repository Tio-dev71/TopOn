import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../utils/cloudinary';
import * as contentController from '../controllers/content.controller';

const router = Router();

router.post('/', authenticate, authorize('REVIEWER'), upload.array('files', 10), contentController.submitContent);
router.get('/my', authenticate, authorize('REVIEWER'), contentController.getMyContents);
router.get('/campaign/:campaignId', authenticate, contentController.getCampaignContents);
router.put('/:id/status', authenticate, contentController.updateContentStatus);

export default router;
