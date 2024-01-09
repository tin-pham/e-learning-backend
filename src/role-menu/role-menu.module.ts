import { Module } from '@nestjs/common';
import { RoleMenuController } from './role-menu.controller';
import { RoleMenuService } from './role-menu.service';
import { RoleRepository } from '../role/role.repository';
import { MenuRepository } from '../menu/menu.repository';
import { RoleMenuRepository } from './role-menu.repository';

@Module({
  controllers: [RoleMenuController],
  providers: [RoleMenuService, RoleRepository, MenuRepository, RoleMenuRepository],
})
export class RoleMenuModule {}
