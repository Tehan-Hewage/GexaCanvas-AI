import { Router } from 'express';
import { generateImage } from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.use(protect);

router.post('/generate', aiLimiter, generateImage);

export default router;
