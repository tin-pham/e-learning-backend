import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    const message = this.getExceptionMessage(exceptionResponse);

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

    return exception['message'].message;
  }
}
