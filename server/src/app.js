import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { globalLimiter } from './middleware/rateLimiters.js';

import chatRoutes from './routes/chatRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', globalLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    app: 'GexaCanvas AI',
    database: 'Supabase',
  });
});

// Routes
app.use('/api/chats', chatRoutes);
app.use('/api/images', imageRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
