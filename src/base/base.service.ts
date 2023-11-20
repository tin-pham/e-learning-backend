import { HttpException, Injectable } from '@nestjs/common';

interface Exception {
  status: number;
  code: string;
  message: string;
}

@Injectable()
export class BaseService {
  formatException(exception: Exception) {
    const { status, code, message } = exception;
    throw new HttpException({ message: { code, message } }, status);
  }
}
