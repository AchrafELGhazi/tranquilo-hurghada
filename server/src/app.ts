import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  errorHandler,
} from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFoundHandler';

const app = express();

// CORS configuration
//   const allowedOrigins = [
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "https://localhost:3000",
//     "https://localhost:3001",
//     env.FRONTEND_URL,
//   ];

//   // Add production origins
//   if (env.NODE_ENV === "production") {
//     // allowedOrigins.push('https://trevo.ma');
//   }

// Middleware
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

//     app.use(
//       expressWinston.logger({
//         winstonInstance: logger,
//         meta: true,
//         msg: 'HTTP {{req.method}} {{req.url}}',
//         expressFormat: true,
//         colorize: false,
//         ignoreRoute: req => {
//           return req.url === '/health' || req.url === '/';
//         },
//       })
// );

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running!' });
});

//   app.get('/health', (_req, res) => {
//     res.status(200).json({
//       status: 'OK',
//       timestamp: new Date().toISOString(),
//       uptime: process.uptime(),
//       environment: env.NODE_ENV,
//       version: env.API_VERSION,
//     });
//   });

//   const apiPrefix = `/api/${env.API_VERSION}`;
//   app.use(apiPrefix, apiRouter);

app.use(notFoundHandler);

app.use(errorHandler);

//    app.use(
//      expressWinston.errorLogger({
//        winstonInstance: logger,
//        meta: true,
//        msg: 'HTTP {{req.method}} {{req.url}} - {{err.message}}',
//      })
//    );

export default app;
