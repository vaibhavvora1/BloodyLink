import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import { env } from './config/env.js';
import { generalRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { sendResponse } from './utils/response.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(hpp());

app.use('/api', generalRateLimiter);

app.get('/api/health', (req, res) => {
  return sendResponse(res, 200, true, 'Bloodlink API is healthy', {
    env: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
