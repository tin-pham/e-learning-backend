import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { UserRepository } from '../user/user.repository';
import { SignInDTO } from './dto/auth.dto';
import { SignInRO } from './ro/auth.ro';
import { UserEntity } from 'src/user/user.entity';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  async signIn(user: UserEntity) {
    const payload: IJwtPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return plainToInstance(SignInRO, { accessToken });
  }

  async validateSignIn(dto: SignInDTO) {
    const { username, password } = dto;

    // Check username exists
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      const { status, code, message } =
        EXCEPTION.AUTH.USERNAME_OR_PASSWORD_INVALID;
      this.formatException({ status, code, message });
    }

    // Check password match
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      const { status, code, message } =
        EXCEPTION.AUTH.USERNAME_OR_PASSWORD_INVALID;
      this.formatException({ status, code, message });
    }

    return user;
  }

  async storeToken(userId: string, token: string) {
    await this.cacheService.set(userId, token);
  }
}
