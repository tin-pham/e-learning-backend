import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base';
import { EXCEPTION, IJwtPayload } from '../../common';
import { UserRepository } from '../../user/user.repository';
import { UserRoleRepository } from '../../user-role/user-role.repository';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class RefreshTokenService extends BaseService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {
    super();
  }

  async store(userId: string, tokenId: string): Promise<void> {
    await this.cacheService.set(this.getKey(userId), tokenId);
  }

  async clear(userId: string): Promise<void> {
    await this.cacheService.del(this.getKey(userId));
  }

  async validatePayloadAndRefreshToken(payload: IJwtPayload, tokenId: string) {
    // Validate token match
    const storedId = await this.cacheService.get(this.getKey(payload.userId));
    if (storedId !== tokenId) {
      const { status, code, message } = EXCEPTION.AUTH.REFRESH_TOKEN_INVALID;
      this.formatException({
        status,
        code,
        message,
      });
    }

    // Validate user exists
    const user = await this.userRepository.findOneById(payload.userId);
    if (!user) {
      const { status, code, message } = EXCEPTION.AUTH.REFRESH_TOKEN_INVALID;
      this.formatException({
        status,
        code,
        message,
      });
    }

    user.roles = await this.userRoleRepository.findRolesByUserId(user.id);
    if (!user.roles) {
      const { status, code, message } = EXCEPTION.AUTH.USER_DOES_NOT_HAVE_ROLES;
      this.formatException({
        status,
        code,
        message,
      });
    }

    return user;
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
