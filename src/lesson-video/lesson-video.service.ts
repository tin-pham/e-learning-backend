import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonVideoEntity } from './lesson-video.entity';
import { LessonRepository } from '../lesson/lesson.repository';
import { VideoRepository } from '../video/video.repository';
import { LessonVideoRepository } from './lesson-video.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonVideoBulkDeleteDTO, LessonVideoBulkStoreDTO } from './dto/lesson-video.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class LessonVideoService extends BaseService {
  private readonly logger = new Logger(LessonVideoService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonRepository: LessonRepository,
    private readonly videoRepository: VideoRepository,
    private readonly lessonVideoRepository: LessonVideoRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: LessonVideoBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const lessonVideoData = dto.lessonIds.flatMap((lessonId) =>
        dto.videoIds.map((videoId) => new LessonVideoEntity({ lessonId, videoId, createdBy: actorId })),
      );

      await this.lessonVideoRepository.insertMultiple(lessonVideoData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.LESSON_VIDEO.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Store lesson file successfully',
      actorId,
    });
  }

  async bulkDelete(dto: LessonVideoBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { lessonIds, videoIds } = dto;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.lessonVideoRepository.deleteMultipleByLessonIdsAndVideoIds(lessonIds, videoIds, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.LESSON_VIDEO.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete lesson file successfully',
      actorId,
    });
  }

  private async validateBulkStore(dto: LessonVideoBulkStoreDTO, actorId: number) {
    // check lesson exists
    const lessonCount = await this.lessonRepository.countByIds(dto.lessonIds);
    if (lessonCount !== dto.lessonIds.length) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check video exists
    const videoCount = await this.videoRepository.countByIds(dto.videoIds);
    if (videoCount !== dto.videoIds.length) {
      const { status, message, code } = EXCEPTION.FILE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check lesson video exist
    const lessonVideoCount = await this.lessonVideoRepository.countByLessonIdsAndVideoIds(dto.lessonIds, dto.videoIds);
    if (lessonVideoCount > 0) {
      const { status, message, code } = EXCEPTION.LESSON_VIDEO.ALREADY_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateBulkDelete(dto: LessonVideoBulkDeleteDTO, actorId: number) {
    // check lesson exists
    const lessonCount = await this.lessonRepository.countByIds(dto.lessonIds);
    if (lessonCount !== dto.lessonIds.length) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check video exists
    const videoCount = await this.videoRepository.countByIds(dto.videoIds);
    if (videoCount !== dto.videoIds.length) {
      const { status, message, code } = EXCEPTION.VIDEO.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
