import { Module } from '@nestjs/common';
import path from 'path';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { VideoService } from './video.service';
import { NestjsFormDataModule, FileSystemStoredFile } from 'nestjs-form-data';

@Module({
  imports: [
    NestjsFormDataModule.config({ storage: FileSystemStoredFile, fileSystemStoragePath: path.join(process.cwd(), 'data', 'video') }),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
