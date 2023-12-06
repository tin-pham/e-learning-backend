import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey: string) => {
      return this.validate(apiKey);
    });
  }

  public validate = (apiKey: string) => {
    console.log();
    return this.apiKeyService.validate(apiKey);
  };
}
