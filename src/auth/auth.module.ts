import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.stategy';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, LocalStrategy],
})
export class AuthModule {}