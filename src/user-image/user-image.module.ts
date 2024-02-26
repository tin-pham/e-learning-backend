import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { UserImageController } from './user-image.controller';
import { UserImageService } from './user-image.service';
import { S3Service } from '../s3/s3.service';
import { UserImageRepository } from './user-image.repository';
import { ImageRepository } from '../image/image.repository';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [UserImageController],
  providers: [UserImageService, UserImageRepository, S3Service, ImageRepository],
})
export class UserImageModule {}
