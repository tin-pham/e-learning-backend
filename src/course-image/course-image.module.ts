import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { CourseImageController } from './course-image.controller';
import { CourseImageService } from './course-image.service';
import { S3Service } from '../s3/s3.service';
import { ImageRepository } from '../image/image.repository';
import { CourseImageRepository } from './course-image.repository';
import { CourseRepository } from '../course/course.repository';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [CourseImageController],
  providers: [CourseImageRepository, CourseImageService, ImageRepository, S3Service, CourseRepository],
})
export class CourseImageModule {}
