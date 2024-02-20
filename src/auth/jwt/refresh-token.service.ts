import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base';
import { EXCEPTION, IJwtPayload } from '../../common';
import { UserRepository } from '../../user/user.repository';
import { UserRoleRepository } from '../../user-role/user-role.repository';
import { CacheService } from '../../cache/cache.service';
import { ElasticsearchLoggerService } from '../../elastic-search-logger/elastic-search-logger.service';

@Injectable()
export class RefreshTokenService extends BaseService {
  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly cacheService: CacheService,
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {
    super(elasticLogger);
  }

  async store(userId: number, tokenId: string): Promise<void> {
    await this.cacheService.set(this.getKey(userId), tokenId);
  }

  async clear(userId: number): Promise<void> {
    await this.cacheService.del(this.getKey(userId));
  }

  async validatePayloadAndRefreshToken(payload: IJwtPayload, tokenId: string) {
    const actorId = payload.userId;
    // Validate token match
    const storedId = await this.cacheService.get(this.getKey(payload.userId));
    if (storedId !== tokenId) {
      const { status, code, message } = EXCEPTION.AUTH.REFRESH_TOKEN_INVALID;
      this.throwException({ status, code, message, actorId });
    }

    // Validate user exists
    const user = (await this.userRepository.findOneById(payload.userId)) as any;
    if (!user) {
      const { status, code, message } = EXCEPTION.AUTH.REFRESH_TOKEN_INVALID;
      this.throwException({ status, code, message, actorId });
    }

    user.roles = await this.userRoleRepository.findRolesByUserId(user.id);
    if (!user.roles) {
      const { status, code, message } = EXCEPTION.AUTH.USER_DOES_NOT_HAVE_ROLES;
      this.throwException({ status, code, message, actorId });
    }
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
