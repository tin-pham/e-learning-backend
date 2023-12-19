import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ElasticsearchLoggerService } from '../../elastic-search-logger/elastic-search-logger.service';
import { IRequestWithUser } from '../interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly elasticLogger: ElasticsearchLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestWithUser>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message = this.getExceptionMessage(exceptionResponse);

    // Log the exception if it 401 or 403
    if (status === HttpStatus.UNAUTHORIZED) {
      this.elasticLogger.error({
        status,
        message,
      });
    }
    if (status === HttpStatus.FORBIDDEN) {
      this.elasticLogger.error({
        status,
        message,
        actor: request.user.username,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      code: exceptionResponse['message'].code,
    });
  }

  getExceptionMessage(exception: object | string) {
    if (Array.isArray(exception['message'])) {
      return exception['message'].join(', ');
    }

    if (typeof exception['message'] === 'string') {
      return exception['message'];
    }

    return exception['message'].message;
  }
}
