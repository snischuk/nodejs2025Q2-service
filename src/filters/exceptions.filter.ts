import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { HttpAdapterHost } from '@nestjs/core';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let description = 'Internal server error';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (
        typeof response === 'object' &&
        response !== null &&
        ('message' in response || 'error' in response)
      ) {
        description = response?.['message'] || response?.['error'];
      }
    }

    const responseBody = {
      method: ctx.getRequest().method,
      url: httpAdapter.getRequestUrl(ctx.getRequest()),
      statusCode: httpStatus,
      description,
    };

    const { stack } = exception as Error;

    this.loggerService.error(
      `[Exception Filter] ${JSON.stringify(responseBody)}`,
      stack,
    );

    httpAdapter.reply(
      ctx.getResponse(),
      { ...responseBody, timestamp: new Date().toISOString() },
      httpStatus,
    );
  }
}
