import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import {
     errorHandler,
} from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFoundHandler';
import { env } from './config/env';
import apiRouter from './routes/api';

const app = express();
const apiPrefix = `/api/${env.API_VERSION}`;

const allowedOrigins = [
     "http://localhost:3000",
     "https://localhost:3000",
     env.FRONTEND_URL,
];

if (env.NODE_ENV === "production") {
     allowedOrigins.push('https://tranquilo-hurghada.combine');
}

app.use(
     helmet({
          crossOriginResourcePolicy: { policy: 'cross-origin' },
          contentSecurityPolicy: {
               directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
               },
          },
     })
);
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: env.API_VERSION,
  });
});

app.use(apiPrefix, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
