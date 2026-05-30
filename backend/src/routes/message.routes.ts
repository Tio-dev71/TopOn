import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as messageController from '../controllers/message.controller';

const router = Router();

// Get all conversations for current user
router.get('/conversations', authenticate, messageController.getConversations);

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', authenticate, messageController.getMessages);

// Send a message in a conversation
router.post('/conversations/:conversationId/messages', authenticate, messageController.sendMessage);

// Create or get conversation with a reviewer (for brand)
router.post('/conversations', authenticate, messageController.createOrGetConversation);

export default router;
