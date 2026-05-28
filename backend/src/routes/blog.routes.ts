import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as blogController from '../controllers/blog.controller';

const router = Router();

// Public
router.get('/', blogController.getBlogs);
router.get('/tips', blogController.getTipsGuides);
router.get('/:slug', blogController.getBlogBySlug);

// Admin only
router.post('/', authenticate, authorize('ADMIN'), blogController.createBlog);
router.put('/:id', authenticate, authorize('ADMIN'), blogController.updateBlog);
router.delete('/:id', authenticate, authorize('ADMIN'), blogController.deleteBlog);

export default router;
