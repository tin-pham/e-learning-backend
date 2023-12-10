import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../common';
import { RefreshTokenService } from './refresh-token.service';

const configService = new ConfigService();

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<any> {
    const token = req.headers.authorization.replace('Bearer ', '');
    await this.refreshTokenService.validatePayloadAndRefreshToken(
      payload,
      token,
    );
    return payload;
  }
}
