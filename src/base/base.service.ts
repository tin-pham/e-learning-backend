import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';

interface Exception {
  status: number;
  code: string;
  message: string;
  actorId: number | string;
  error?: Error;
}

export interface Success {
  classRO: { new (...args: any[]): any };
  response: any;
  message?: string;
  actorId?: number;
}

@Injectable()
export class BaseService {
  constructor(protected readonly elasticLogger: ElasticsearchLoggerService) {}

  protected throwException(exception: Exception) {
    const { status, code, message, actorId, error } = exception;

    this.elasticLogger.error({
      status,
      code,
      message,
      actorId,
      // remove escape character
      error: error
        ? JSON.stringify(error.message, (_, value) => {
            return value.replace(/[^\w\s]/gi, '');
          })
        : undefined,
    });
    throw new HttpException({ message: { code, message } }, status);
  }

  // success
  protected success(obj: Partial<Success>) {
    const { classRO: classFn, response: data, message, actorId } = obj;

    if (message) {
      this.elasticLogger.info({
        message,
        actorId,
      });
    }

    return plainToInstance(classFn, data, {
      excludeExtraneousValues: true,
    });
  }
}
