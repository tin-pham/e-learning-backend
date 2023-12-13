import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../../base';
import { EXCEPTION } from '../../common';

@Injectable()
export class ApiKeyService extends BaseService {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  validate(apiKey: string) {
    const isMatch = this.configService.get<string>('API_KEY') === apiKey;

    if (!isMatch) {
      const { code, status, message } = EXCEPTION.AUTH.API_KEY_INVALID;
      this.formatException({
        code,
        status,
        message,
      });
    }

    return true;
  }
}
