import { Router } from 'express';
import {
  getChats,
  createChat,
  getChat,
  updateChat,
  deleteChat,
  sendMessage,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.use(protect);

router.route('/').get(getChats).post(createChat);
router.route('/:id').get(getChat).patch(updateChat).delete(deleteChat);
router.post('/:id/messages', aiLimiter, sendMessage);

export default router;
