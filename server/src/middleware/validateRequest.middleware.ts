import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';

const formatZodError = (error: ZodError) => {
    const formattedErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!formattedErrors[path]) {
            formattedErrors[path] = [];
        }
        formattedErrors[path].push(issue.message);
    });

    return formattedErrors;
};

export const validateRequest = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = formatZodError(error);
                logger.warn('Validation failed', { path: req.path, errors });
                return ApiResponse.validationError(res, errors, 'Validation failed');
            }

            logger.error('Validation error:', error);
            return ApiResponse.serverError(res, 'Validation error');
        }
    };
};