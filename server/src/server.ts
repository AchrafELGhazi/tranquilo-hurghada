import app from './app';
import dotenv from 'dotenv';
import { gracefulShutdown } from './middleware/errorHandler.middleware';
import logger from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        healthCheck: `http://localhost:${PORT}/health`
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.debug('Debug information', {
            nodeVersion: process.version,
            platform: process.platform
        });
    }
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
        error: reason instanceof Error ? reason : { reason },
        promise
    });

    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
    });

    process.exit(1);
});

const shutdown = gracefulShutdown(server);
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));