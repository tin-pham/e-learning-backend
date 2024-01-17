import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { VideoService } from './video.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
})
export class VideoModule {}
