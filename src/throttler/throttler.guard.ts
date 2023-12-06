import { HttpException } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';
import { EXCEPTION } from '../common';

export class ThrottlerGuard extends NestThrottlerGuard {
  protected override async throwThrottlingException(): Promise<void> {
    const { status, message, code } = EXCEPTION.APP.EXCEED_RATE_LIMIT;
    throw new HttpException({ message: { code, message } }, status);
  }
}
