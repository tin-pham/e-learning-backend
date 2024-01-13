import { Module } from '@nestjs/common';
import { DifficultyController } from './difficulty.controller';
import { DifficultyRepository } from './difficulty.repository';
import { DifficultyService } from './difficulty.service';

@Module({
  controllers: [DifficultyController],
  providers: [DifficultyService, DifficultyRepository],
})
export class DifficultyModule {}
