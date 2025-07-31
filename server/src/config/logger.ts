import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Environment helper functions
const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
const isProduction = (): boolean => process.env.NODE_ENV === 'production';

// Ensure logs directory exists
const logPath = process.env.LOG_FILE_PATH || './logs';
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath, { recursive: true });
}

// Custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Custom log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(logColors);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({
      timestamp,
      level,
      message,
      stack,
      service,
      component,
      correlationId,
      ...meta
    }) => {
      let log = `${timestamp} [${level}]`;

      if (service) log += ` [${service}]`;
      if (component) log += ` [${component}]`;
      if (correlationId) log += ` [${correlationId}]`;

      log += `: ${message}`;

      if (stack) {
        log += `\n${stack}`;
      }

      const metaStr =
        Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '';
      if (metaStr) {
        log += `\nMeta: ${metaStr}`;
      }

      return log;
    }
  )
);

// File format for production
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata()
);

// Create transport array
const transports: winston.transport[] = [];

// Console transport for development
if (isDevelopment()) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || 'debug',
    })
  );
}

// File transports
if (isProduction()) {
  // Combined log file (info and above)
  transports.push(
    new DailyRotateFile({
      filename: path.join(logPath, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      level: 'info',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    })
  );
}

// Error log file (always created)
transports.push(
  new DailyRotateFile({
    filename: path.join(logPath, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true,
  })
);

// Warning log file
transports.push(
  new DailyRotateFile({
    filename: path.join(logPath, 'warn-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    level: 'warn',
    maxSize: '10m',
    maxFiles: '14d',
    zippedArchive: true,
  })
);

// HTTP access log file
transports.push(
  new DailyRotateFile({
    filename: path.join(logPath, 'access-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    level: 'http',
    maxSize: '20m',
    maxFiles: '7d',
    zippedArchive: true,
  })
);

// Create main logger
export const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp', 'label'],
    })
  ),
  defaultMeta: {
    service: 'auth-api',
    version: process.env.npm_package_version || '1.0.0',
  },
  transports,
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test', // Silent during tests
});

// Handle logger errors
logger.on('error', error => {
  console.error('Logger error:', error);
});

// Child loggers for different components
export const authLogger = logger.child({ component: 'auth' });
export const dbLogger = logger.child({ component: 'database' });
export const apiLogger = logger.child({ component: 'api' });

// Utility logging functions
export const logRequest = (
  method: string,
  url: string,
  statusCode?: number,
  responseTime?: number,
  userId?: string,
  correlationId?: string
) => {
  apiLogger.http('API Request', {
    method,
    url,
    statusCode,
    responseTime: responseTime ? `${responseTime}ms` : undefined,
    userId,
    correlationId,
    timestamp: new Date().toISOString(),
  });
};

export const logBusinessEvent = (
  event: string,
  data: Record<string, any>,
  correlationId?: string,
  userId?: string
) => {
  logger.info('Business Event', {
    event,
    data,
    correlationId,
    userId,
    timestamp: new Date().toISOString(),
  });
};

export const logError = (
  error: Error | string,
  context?: Record<string, any>,
  correlationId?: string
) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  logger.error('Application Error', {
    message: errorMessage,
    stack: errorStack,
    correlationId,
    timestamp: new Date().toISOString(),
    ...context,
  });
};

export const logAuth = (
  action: string,
  userId?: string,
  email?: string,
  success: boolean = true,
  correlationId?: string,
  additionalData?: Record<string, any>
) => {
  authLogger.info('Auth Event', {
    action,
    userId,
    email,
    success,
    correlationId,
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
};

export const logDatabase = (
  operation: string,
  table?: string,
  duration?: number,
  recordCount?: number,
  correlationId?: string
) => {
  dbLogger.debug('Database Operation', {
    operation,
    table,
    duration: duration ? `${duration}ms` : undefined,
    recordCount,
    correlationId,
    timestamp: new Date().toISOString(),
  });
};

// Morgan stream for HTTP logging
export const loggerStream = {
  write: (message: string) => {
    // Remove trailing newline and log as HTTP level
    apiLogger.http(message.trim());
  },
};

// Performance logging utility
export const createPerformanceLogger = (
  operation: string,
  correlationId?: string
) => {
  const start = Date.now();

  return {
    end: (additionalData?: Record<string, any>) => {
      const duration = Date.now() - start;
      logger.debug('Performance', {
        operation,
        duration: `${duration}ms`,
        correlationId,
        timestamp: new Date().toISOString(),
        ...additionalData,
      });
      return duration;
    },
  };
};

// Correlation ID generator
export const generateCorrelationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default logger;
