import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { FileBulkDeleteDTO, FileBulkStoreDTO, FileGetListDTO } from './dto/file.dto';
import { FileGetListRO } from './ro/file.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class FileService extends BaseService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly fileRepository: FileRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: FileBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const fileData = dto.urls.map((url) => new FileEntity({ url, createdBy: actorId }));
      await this.fileRepository.insertMultiple(fileData);
    } catch (error) {
      const { status, message, code } = EXCEPTION.FILE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Files has been stored successfully',
      actorId,
    });
  }

  async bulkDelete(dto: FileBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(dto, actorId);

    try {
      await this.fileRepository.deleteMultipleByIds(dto.ids, actorId);
    } catch (error) {
      const { status, message, code } = EXCEPTION.FILE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Files has been deleted successfully',
      actorId,
    });
  }

  async getList(dto: FileGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.fileRepository.find(dto);

      return this.success({
        classRO: FileGetListRO,
        response,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.FILE.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(dto: FileBulkDeleteDTO, actorId: number) {
    // Check exist
    const fileCount = await this.fileRepository.countByIds(dto.ids);
    if (fileCount !== dto.ids.length) {
      const { status, message, code } = EXCEPTION.FILE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
