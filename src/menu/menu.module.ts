import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './menu.repository';

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuRepository],
})
export class MenuModule {}
