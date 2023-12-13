import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RefreshTokenService } from './jwt/refresh-token.service';
import { SignInDTO } from './dto/auth.dto';
import { RefreshTokenRO, SignInRO } from './ro/auth.ro';

@Injectable()
export class AuthService extends BaseService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userRoleRepository: UserRoleRepository,
  ) {
    super();
  }

  async signIn(user: UserEntity) {
    const payload: IJwtPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles.map((role) => role.name),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    // Store refresh token in cache
    await this.refreshTokenService.store(user.id, refreshToken);

    return plainToInstance(SignInRO, { accessToken, refreshToken });
  }

  async validateSignIn(dto: SignInDTO): Promise<UserEntity> {
    const { username, password } = dto;

    // Check username exists
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      const { status, code, message } =
        EXCEPTION.AUTH.USERNAME_OR_PASSWORD_INVALID;
      this.formatException({ status, code, message });
    }

    // Check password match
    const isValidPassword = await this.validatePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      const { status, code, message } =
        EXCEPTION.AUTH.USERNAME_OR_PASSWORD_INVALID;
      this.formatException({ status, code, message });
    }

    user.roles = await this.userRoleRepository.findRolesByUserId(user.id);
    if (!user.roles) {
      const { status, code, message } = EXCEPTION.AUTH.USER_DOES_NOT_HAVE_ROLES;
      this.formatException({ status, code, message });
    }

    return user;
  }

  async refreshAccessTokenByUser(decoded: IJwtPayload) {
    let accessToken: string;
    try {
      accessToken = await this.jwtService.signAsync({
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        displayName: decoded.displayName,
        roles: decoded.roles,
      });
    } catch (error) {
      this.logger.error(error);

      const { status, code, message } = EXCEPTION.AUTH.REFRESH_TOKEN_FAILED;
      this.formatException({ status, code, message });
    }
    return plainToInstance(RefreshTokenRO, { accessToken });
  }

  async validatePayload(payload: IJwtPayload) {
    const user = await this.userRepository.findOneById(payload.userId);
    if (!user) {
      const { status, code, message } = EXCEPTION.AUTH.AUTHORIZE_FAILED;
      this.formatException({ status, code, message });
    }

    user.roles = await this.userRoleRepository.findRolesByUserId(user.id);
    if (!user.roles) {
      const { status, code, message } = EXCEPTION.AUTH.USER_DOES_NOT_HAVE_ROLES;
      this.formatException({ status, code, message });
    }
  }

  private async validatePassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
