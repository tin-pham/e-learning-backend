import { Module } from '@nestjs/common';
import { DirectoryController } from './directory.controller';
import { DirectoryRepository } from './directory.repository';
import { DirectoryService } from './directory.service';

@Module({
  controllers: [DirectoryController],
  providers: [DirectoryService, DirectoryRepository],
})
export class DirectoryModule {}
