import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  constructor(private readonly apiKeyService: ApiKeyService) {
    super({
      passReqToCallback: true,
    });
  }

  validate(req: Request) {
    const apiKey = req.headers['x-api-key'] as string;
    return this.apiKeyService.validate(apiKey);
  }
}
