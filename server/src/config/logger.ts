import winston from 'winston';
import { Request } from 'express';
import { inspect } from 'util';

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'http';

interface LogContext {
     [key: string]: unknown;
}

interface RequestLogContext extends LogContext {
     method?: string;
     path?: string;
     ip?: string;
     userId?: string;
     correlationId?: string;
}

const colors = {
     error: 'red',
     warn: 'yellow',
     info: 'green',
     debug: 'blue',
     http: 'magenta',
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
     winston.format((info) => {
          if (info instanceof Error) {
               return {
                    ...info,
                    message: info.message,
                    stack: info.stack,
               };
          }

          if (typeof info.message === 'object') {
               return {
                    ...info,
                    message: inspect(info.message, { depth: 5, colors: true }),
               };
          }

          return info;
     })(),
     winston.format.colorize({ all: true }),
     winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          let log = `${timestamp} [${level}]: ${message}`;

          if (stack) {
               log += `\n${stack}`;
          }

          if (Object.keys(meta).length > 0) {
               log += `\n${inspect(meta, { depth: 5, colors: true })}`;
          }

          return log;
     })
);

const logger = winston.createLogger({
     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
     levels: {
          error: 0,
          warn: 1,
          info: 2,
          debug: 3,
          http: 4,
     },
     transports: [
          new winston.transports.Console({
               format: consoleFormat,
               handleExceptions: true,
          }),
     ],
     exitOnError: false,
});

export const loggerWithContext = (context: LogContext) => ({
     error: (message: string, meta?: LogContext) =>
          logger.error(message, { ...context, ...meta }),
     warn: (message: string, meta?: LogContext) =>
          logger.warn(message, { ...context, ...meta }),
     info: (message: string, meta?: LogContext) =>
          logger.info(message, { ...context, ...meta }),
     debug: (message: string, meta?: LogContext) =>
          logger.debug(message, { ...context, ...meta }),
     http: (message: string, meta?: LogContext) =>
          logger.log('http', message, { ...context, ...meta }),
});

export const requestLogger = (req: Request, correlationId: string) =>
     loggerWithContext({
          method: req.method,
          path: req.path,
          ip: req.ip,
          userId: (req as any).user?.id,
          correlationId,
     });

process.on('unhandledRejection', (reason) => {
     logger.error('Unhandled Rejection:', reason instanceof Error ? reason : { reason });
});

process.on('uncaughtException', (error) => {
     logger.error('Uncaught Exception:', error);
     process.exit(1);
});

export default logger;