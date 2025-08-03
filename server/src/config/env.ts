import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
     NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
     PORT: z.string().regex(/^\d+$/).transform(Number).default(5000),
     DATABASE_URL: z.string().url(),
     JWT_SECRET: z.string().min(32),
     JWT_EXPIRES_IN: z.string().default('7d'),
     JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
     LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
     LOG_FILE_PATH: z.string().default('./logs'),
     FRONTEND_URL: z.string().url(),
     PROD_URL: z.string().url()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
     console.error('Invalid environment variables:', _env.error.format());
     process.exit(1);
}

export const env = _env.data;
