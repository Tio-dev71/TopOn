import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as reviewerController from '../controllers/reviewer.controller';

const router = Router();

router.get('/', reviewerController.searchReviewers);
router.get('/bookmarks', authenticate, authorize('ADVERTISER'), reviewerController.getBookmarks);
router.get('/:id', reviewerController.getReviewerDetail);
router.post('/:id/invite', authenticate, authorize('ADVERTISER'), reviewerController.inviteReviewer);
router.post('/:id/bookmark', authenticate, authorize('ADVERTISER'), reviewerController.bookmarkReviewer);

export default router;
