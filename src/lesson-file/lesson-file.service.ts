import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonFileRepository } from './lesson-file.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonFileBulkStoreDTO } from './dto/lesson-file.dto';
import { FileRepository } from '../file/file.repository';
import { LessonFileEntity } from './lesson-file.entity';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class LessonFileService extends BaseService {
  private readonly logger = new Logger(LessonFileService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonRepository: LessonRepository,
    private readonly fileRepository: FileRepository,
    private readonly lessonFileRepository: LessonFileRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: LessonFileBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const lessonFileData = dto.lessonIds.flatMap((lessonId) =>
        dto.fileIds.map((fileId) => new LessonFileEntity({ lessonId, fileId, createdBy: actorId })),
      );

      await this.lessonFileRepository.insertMany(lessonFileData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.LESSON_FILE.STORE_FAILED;
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

  private async validateBulkStore(dto: LessonFileBulkStoreDTO, actorId: number) {
    // check lesson exists
    const lessonCount = await this.lessonRepository.countByIds(dto.lessonIds);
    if (lessonCount !== dto.lessonIds.length) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check file exists
    const fileCount = await this.fileRepository.countByIds(dto.fileIds);
    if (fileCount !== dto.fileIds.length) {
      const { status, message, code } = EXCEPTION.FILE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check lesson file exist
    const lessonFileCount = await this.lessonFileRepository.countByLessonIdsAndFileIds(dto.lessonIds, dto.fileIds);
    if (lessonFileCount > 0) {
      const { status, message, code } = EXCEPTION.LESSON_FILE.ALREADY_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
