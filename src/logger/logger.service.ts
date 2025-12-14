import { Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';
import { mkdirSync, appendFileSync, statSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';

const BYTES_IN_KB = 1024;
const DEFAULT_MAX_FILE_SIZE_KB = 8 * BYTES_IN_KB;
const DEFAULT_LOG_LEVEL = 'log';
const LOGS_DIR_PATH = '../../logs';
const COMMON_LOG_FILE_NAME = 'common.log';
const ERROR_LOG_FILE_NAME = 'error.log';
const LOG_LEVELS = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];
const SENSITIVE_FIELDS = ['password', 'oldPassword', 'newPassword'];

@Injectable()
export class LoggerService extends ConsoleLogger {
  private currentLogLevel: LogLevel;
  private commonLogFilePath: string;
  private errorLogFilePath: string;
  private maxFileSize: number;

  constructor() {
    super();

    this.currentLogLevel =
      (process.env.LOG_LEVEL as LogLevel) || DEFAULT_LOG_LEVEL;
    this.commonLogFilePath = join(
      __dirname,
      LOGS_DIR_PATH,
      COMMON_LOG_FILE_NAME,
    );
    this.errorLogFilePath = join(__dirname, LOGS_DIR_PATH, ERROR_LOG_FILE_NAME);
    this.maxFileSize =
      parseInt(process.env.MAX_FILE_SIZE_KB) * BYTES_IN_KB ||
      DEFAULT_MAX_FILE_SIZE_KB;

    console.log(
      'Showing messages with log level less than or equal to:',
      this.currentLogLevel,
    );
    console.log(
      'Enabled log levels:',
      LOG_LEVELS.filter(this.isEnabledLevel, this).join(', '),
      '\n',
    );

    this.createLogMethods();
    this.addErrorHandlers();
  }

  private isEnabledLevel(level: LogLevel): boolean {
    const index = LOG_LEVELS.indexOf(level);
    const currentIndex = LOG_LEVELS.indexOf(this.currentLogLevel);

    return index >= currentIndex;
  }

  private logMessageToFile(logLevel: LogLevel, message: string) {
    const logFilePath =
      logLevel.toString() === 'fatal' || logLevel.toString() === 'error'
        ? this.errorLogFilePath
        : this.commonLogFilePath;
    const timestamp = new Date().toISOString();

    mkdirSync(dirname(logFilePath), { recursive: true });

    SENSITIVE_FIELDS.forEach((field) => {
      if (message.includes(`"${field}":`)) {
        const regex = new RegExp(`"${field}":"[^"]+"`, 'g');
        message = message.replace(regex, `"${field}":"Not logged"`);
      }
    });

    appendFileSync(
      logFilePath,
      `${timestamp} - [${logLevel.toUpperCase()}] ${message}\n`,
    );

    const fileStatus = statSync(logFilePath);
    const pathWithoutExtension = logFilePath.replace(/\.[^/.]+$/, '');

    if (fileStatus.size >= this.maxFileSize) {
      const rotatedFilePath = `${pathWithoutExtension}.${timestamp.replace(
        /:/g,
        '-',
      )}.log`;

      renameSync(logFilePath, rotatedFilePath);
    }
  }

  private logWithLevel(level: LogLevel, message: string, trace?: string) {
    if (this.isEnabledLevel(level)) {
      this.logMessageToFile(level, message);

      if (trace && typeof super[level] === 'function') {
        super[level](message, trace);
      } else if (typeof super[level] === 'function') {
        super[level](message);
      }
    }
  }

  private createLogMethods() {
    LOG_LEVELS.forEach((level: LogLevel) => {
      this[level] = (message: string, trace?: string) => {
        this.logWithLevel(level, message, trace);
      };
    });
  }

  private addErrorHandlers() {
    process.on('uncaughtException', (error: Error) => {
      this.error(`[Uncaught Exception] ${error.message}`, error.stack);

      process.exit(1);
    });

    process.on('unhandledRejection', (error: Error) => {
      this.error(`[Unhandled Rejection] ${error.message}`, error.stack);

      process.exit(1);
    });
  }
}
