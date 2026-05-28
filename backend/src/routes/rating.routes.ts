import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as ratingController from '../controllers/rating.controller';

const router = Router();

router.post('/', authenticate, ratingController.createRating);
router.get('/user/:userId', ratingController.getUserRatings);

export default router;
