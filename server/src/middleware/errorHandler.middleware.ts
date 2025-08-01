// src/middleware/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logError, generateCorrelationId } from '../config/logger';

// Custom error class for operational errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly correlationId: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.correlationId = generateCorrelationId();

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interfaces
interface BaseErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    correlationId: string;
  };
  timestamp: string;
  path: string;
  method: string;
}

interface DevErrorResponse extends BaseErrorResponse {
  error: BaseErrorResponse['error'] & {
    stack?: string;
    details?: any;
  };
}

// Handle Prisma errors
const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): AppError => {
  let appError: AppError;

  switch (error.code) {
    case 'P2002':
      const field = error.meta?.target as string[] | undefined;
      const fieldName = field?.[0] || 'field';
      appError = new AppError(
        `${fieldName} already exists`,
        409,
        true,
        'DUPLICATE_FIELD'
      );
      break;

    case 'P2025':
      appError = new AppError(
        'Record not found',
        404,
        true,
        'RECORD_NOT_FOUND'
      );
      break;

    case 'P2003':
      appError = new AppError(
        'Related record not found',
        400,
        true,
        'FOREIGN_KEY_VIOLATION'
      );
      break;

    case 'P2014':
      appError = new AppError(
        'Invalid data: required relation missing',
        400,
        true,
        'REQUIRED_RELATION_VIOLATION'
      );
      break;

    case 'P2011':
      const nullField = error.meta?.constraint as string;
      appError = new AppError(
        `${nullField} cannot be null`,
        400,
        true,
        'NULL_CONSTRAINT_VIOLATION'
      );
      break;

    case 'P2012':
      appError = new AppError(
        'Missing required field',
        400,
        true,
        'MISSING_REQUIRED_FIELD'
      );
      break;

    case 'P2016':
      appError = new AppError(
        'Invalid query parameters',
        400,
        true,
        'INVALID_QUERY'
      );
      break;

    case 'P1008':
      appError = new AppError(
        'Database operation timeout',
        408,
        true,
        'DATABASE_TIMEOUT'
      );
      break;

    case 'P1001':
      appError = new AppError(
        'Database connection failed',
        503,
        true,
        'DATABASE_UNREACHABLE'
      );
      break;

    default:
      logError(`Unhandled Prisma error: ${error.code}`, {
        prismaCode: error.code,
        prismaMessage: error.message,
        prismaMeta: error.meta,
      });
      appError = new AppError(
        'Database operation failed',
        500,
        true,
        'DATABASE_ERROR'
      );
  }

  return appError;
};

// Handle JWT errors
const handleJWTError = (error: Error): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401, true, 'INVALID_TOKEN');
  }
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token has expired', 401, true, 'TOKEN_EXPIRED');
  }
  if (error.name === 'NotBeforeError') {
    return new AppError('Token not active', 401, true, 'TOKEN_NOT_ACTIVE');
  }
  return new AppError('Authentication failed', 401, true, 'AUTH_ERROR');
};

// Handle validation errors
const handleValidationError = (error: any): AppError => {
  if (error.array && typeof error.array === 'function') {
    const errors = error.array();
    const message = errors
      .map((err: any) => `${err.path}: ${err.msg}`)
      .join(', ');
    return new AppError(
      `Validation error: ${message}`,
      400,
      true,
      'VALIDATION_ERROR'
    );
  }

  if (error.isJoi) {
    const message = error.details
      .map((detail: any) => detail.message)
      .join(', ');
    return new AppError(
      `Validation error: ${message}`,
      400,
      true,
      'VALIDATION_ERROR'
    );
  }

  if (error.name === 'ValidationError') {
    return new AppError(error.message, 400, true, 'VALIDATION_ERROR');
  }

  return new AppError('Validation failed', 400, true, 'VALIDATION_ERROR');
};

// Handle cast errors (usually from invalid IDs)
const handleCastError = (error: any): AppError => {
  return new AppError('Invalid ID format', 400, true, 'INVALID_ID');
};

// Handle syntax errors (malformed JSON, etc.)
const handleSyntaxError = (error: SyntaxError): AppError => {
  if (error.message.includes('JSON')) {
    return new AppError('Invalid JSON format', 400, true, 'INVALID_JSON');
  }
  return new AppError('Malformed request', 400, true, 'SYNTAX_ERROR');
};

// Send error response in development
const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  const errorResponse: DevErrorResponse = {
    success: false,
    error: {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      correlationId: err.correlationId,
      stack: err.stack,
      details: {
        name: err.name,
        isOperational: err.isOperational,
      },
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  res.status(err.statusCode).json(errorResponse);
};

// Send error response in production
const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  if (err.isOperational) {
    const errorResponse: BaseErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        correlationId: err.correlationId,
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    };

    res.status(err.statusCode).json(errorResponse);
  } else {
    logError('Non-operational error occurred', {
      error: err.message,
      stack: err.stack,
      correlationId: err.correlationId,
    });

    const errorResponse: BaseErrorResponse = {
      success: false,
      error: {
        message: 'Something went wrong',
        statusCode: 500,
        correlationId: err.correlationId,
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    };

    res.status(500).json(errorResponse);
  }
};

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  // Handle specific error types
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(error);
  } else if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError' ||
    error.name === 'NotBeforeError'
  ) {
    error = handleJWTError(error);
  } else if (
    error.name === 'ValidationError' ||
    (error as any).isJoi ||
    (error as any).array
  ) {
    error = handleValidationError(error);
  } else if (error.name === 'CastError') {
    error = handleCastError(error);
  } else if (error instanceof SyntaxError) {
    error = handleSyntaxError(error);
  } else if (!(error instanceof AppError)) {
    const appError = new AppError(
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Internal server error',
      500,
      false
    );
    error = appError;
  }

  const appError = error as AppError;

  // Log error with correlation ID
  logError(
    appError,
    {
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.userId,
      statusCode: appError.statusCode,
      isOperational: appError.isOperational,
    },
    appError.correlationId
  );

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(appError, req, res);
  } else {
    sendErrorProd(appError, req, res);
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    true,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

export const asyncHandler = <T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>
) => {
  return (req: T, res: U, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createError = {
  badRequest: (message: string = 'Bad request', code?: string) =>
    new AppError(message, 400, true, code),

  unauthorized: (message: string = 'Unauthorized', code?: string) =>
    new AppError(message, 401, true, code),

  forbidden: (message: string = 'Forbidden', code?: string) =>
    new AppError(message, 403, true, code),

  notFound: (message: string = 'Not found', code?: string) =>
    new AppError(message, 404, true, code),

  conflict: (message: string = 'Conflict', code?: string) =>
    new AppError(message, 409, true, code),

  internal: (message: string = 'Internal server error', code?: string) =>
    new AppError(message, 500, true, code),

  serviceUnavailable: (
    message: string = 'Service unavailable',
    code?: string
  ) => new AppError(message, 503, true, code),
};

// Graceful shutdown handler
export const gracefulShutdown = (server: any) => {
  return (signal: string) => {
    logError(`Received ${signal}. Shutting down gracefully...`);

    server.close(() => {
      logError('Process terminated');
      process.exit(0);
    });

    setTimeout(() => {
      logError('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };
};
