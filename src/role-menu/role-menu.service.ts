import { Injectable, Logger } from '@nestjs/common';
import { RoleMenuBulkStoreDTO } from './dto/role-menu.dto';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { RoleMenuEntity } from './role-menu.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { RoleRepository } from '../role/role.repository';
import { MenuRepository } from '../menu/menu.repository';
import { RoleMenuRepository } from './role-menu.repository';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class RoleMenuService extends BaseService {
  private readonly logger = new Logger(RoleMenuService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly roleRepository: RoleRepository,
    private readonly menuRepository: MenuRepository,
    private readonly roleMenuRepository: RoleMenuRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: RoleMenuBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const roleMenuData = dto.roleIds.flatMap((roleId) =>
        dto.menuIds.map(
          (menuId) =>
            new RoleMenuEntity({
              roleId,
              menuId,
            }),
        ),
      );

      await this.roleMenuRepository.insertMultiple(roleMenuData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ROLE_MENU.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Role menu bulk store successfully',
      actorId,
    });
  }

  private async validateBulkStore(dto: RoleMenuBulkStoreDTO, actorId: number) {
    // Check roles exist
    const rolesCount = await this.roleRepository.countByIds(dto.roleIds);
    if (rolesCount !== dto.roleIds.length) {
      const { code, status, message } = EXCEPTION.ROLE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check menus exist
    const menusCount = await this.menuRepository.countByIds(dto.menuIds);
    if (menusCount !== dto.menuIds.length) {
      const { code, status, message } = EXCEPTION.MENU.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check role and menu exist
    const roleMenuCount = await this.roleMenuRepository.countByRoleIdsAndMenuIds(dto.roleIds, dto.menuIds);
    if (roleMenuCount > 0) {
      const { code, status, message } = EXCEPTION.ROLE_MENU.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
