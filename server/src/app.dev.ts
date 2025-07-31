// // src/app.ts
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import authRoutes from './routes/auth.routes';
// import userRoutes from './routes/user.routes';
// import {
//   errorHandler,
//   notFoundHandler,
// } from './middleware/errorHandler.middleware';

// const app = express();

// // Trust proxy (important for rate limiting and getting real IPs)
// app.set('trust proxy', 1);

// // Security middleware
// app.use(helmet());
// app.use(cors());

// // Logging middleware
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Health check routes
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Auth API is running!',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//   });
// });

// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     environment: process.env.NODE_ENV || 'development',
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// // Handle 404 for unknown routes
// app.use(notFoundHandler);

// // Global error handler (must be last middleware)
// app.use(errorHandler);

// export default app;
