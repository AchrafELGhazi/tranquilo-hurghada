import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().regex(/^\d+$/).transform(Number).default(5000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    API_VERSION: z.string().default('v1'),
    ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
    LOG_FILE_PATH: z.string().default('./logs'),
    FRONTEND_URL: z.string().url(),
    PROD_URL: z.string().url(),
    SALT_ROUNDS: z.string().regex(/^\d+$/).transform(Number).default(10),
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string().min(8),
    ADMIN_NAME: z.string().default('Tranquilo Hurghada'),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().transform(Number).optional(),
    SMTP_SECURE: z.string().transform((val) => val === 'true').optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = {
    ..._env.data,
    isProduction: _env.data.NODE_ENV === 'production',
    isDevelopment: _env.data.NODE_ENV === 'development',
    isTest: _env.data.NODE_ENV === 'test'
};

if (env.isDevelopment) {
    console.log('Environment variables loaded successfully');
    console.log({
        NODE_ENV: env.NODE_ENV,
        PORT: env.PORT,
        API_VERSION: env.API_VERSION,
        LOG_LEVEL: env.LOG_LEVEL,
        ADMIN_EMAIL: env.ADMIN_EMAIL
    });
}