import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { DatabaseService } from '../database';
import { EXCEPTION, IJwtPayload } from '../common';
import { ImageEntity } from '../image/image.entity';
import { CourseImageRepository } from './course-image.repository';
import { ImageRepository } from '../image/image.repository';
import { CourseRepository } from '../course/course.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CourseImageUpsertDTO } from './dto/course-image.dto';
import { S3Service } from '../s3/s3.service';
import { ResultRO } from 'src/common/ro/result.ro';

@Injectable()
export class CourseImageService extends BaseService {
  private readonly logger = new Logger(CourseImageService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly courseRepository: CourseRepository,
    private readonly courseImageRepository: CourseImageRepository,
    private readonly imageRepository: ImageRepository,
    private readonly s3Service: S3Service,
  ) {
    super(elasticLogger);
  }

  async upsert(courseId: number, dto: CourseImageUpsertDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpsert(courseId, actorId);

    try {
      this.database.transaction().execute(async (transaction) => {
        // Clear old image
        const deletedCourseImage = await this.courseImageRepository.deleteByCourseIdWithTransaction(transaction, courseId, actorId);
        if (deletedCourseImage) {
          const deletedImage = await this.imageRepository.deleteWithTransaction(transaction, deletedCourseImage.imageId, actorId);
          if (deletedCourseImage) {
            await this.s3Service.bulkDelete({ urls: [deletedImage.url] }, decoded);
          }
        }

        // Store new image
        const s3Response = await this.s3Service.bulkUpload({ ...dto, directoryPath: 'course' }, decoded);
        const entity = new ImageEntity({
          url: s3Response.data[0].url,
          name: s3Response.data[0].name,
          type: s3Response.data[0].type,
          size: s3Response.data[0].size,
          createdBy: actorId,
        });
        const image = await this.imageRepository.insertWithTransaction(transaction, entity);
        await this.courseImageRepository.insertWithTransaction(transaction, { courseId, imageId: image.id });
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_IMAGE.UPSERT_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Successfully upsert course image',
      actorId,
    });
  }

  private async validateUpsert(courseId: number, actorId: number) {
    // Check exist
    const count = await this.courseRepository.countById(courseId);
    if (!count) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
