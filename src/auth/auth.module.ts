import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../cache/cache.module';
import { LocalStrategy } from './local/local.stategy';
import { JwtStrtegy } from './jwt/jwt.strategy';
import { HeaderApiKeyStrategy } from './api-key/api-key.strategy';
import { JwtRefreshTokenStrategy } from './jwt/jwt-refresh-token.strategy';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './jwt/refresh-token.service';
import { ApiKeyService } from './api-key/api-key.service';

const configService = new ConfigService();

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') },
    }),
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    LocalStrategy,
    JwtStrtegy,
    JwtRefreshTokenStrategy,
    RefreshTokenService,
    ApiKeyService,
    HeaderApiKeyStrategy,
  ],
})
export class AuthModule {}
