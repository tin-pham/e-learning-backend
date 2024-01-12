import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileService, FileRepository],
})
export class FileModule {}
