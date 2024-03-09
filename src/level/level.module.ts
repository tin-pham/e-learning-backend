import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { LevelRepository } from './level.repository';

@Module({
  controllers: [LevelController],
  providers: [LevelService, LevelRepository],
})
export class LevelModule {}
