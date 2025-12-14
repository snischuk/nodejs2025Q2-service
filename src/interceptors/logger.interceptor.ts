import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerHttpInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const { url, body, query, method } = request;

    return next.handle().pipe(
      tap((data) => {
        const bodyPart = `body: ${JSON.stringify(body)}`;
        const queryPart = `query: ${JSON.stringify(query)}`;
        const dataPart = data ? ` data: ${JSON.stringify(data)}` : '';

        this.loggerService.log(
          `[Request] ${method}, url: ${url}, ${bodyPart}, ${queryPart}`,
        );
        this.loggerService.log(
          `[Response] statusCode: ${response.statusCode}, ${dataPart}`,
        );
      }),
    );
  }
}
