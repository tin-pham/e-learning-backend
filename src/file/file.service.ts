import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { FileRepository } from './file.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { FileStoreDTO } from './dto/file.dto';
import { FileDeleteRO, FileStoreRO } from './ro/file.ro';

@Injectable()
export class FileService extends BaseService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly fileRepository: FileRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: FileStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    const response = new FileStoreRO();

    try {
      const file = await this.fileRepository.insert(dto);

      response.id = file.id;
      response.url = file.url;
    } catch (error) {
      const { status, message, code } = EXCEPTION.FILE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: FileStoreRO,
      response,
      message: 'File has been stored successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new FileDeleteRO();

    try {
      const file = await this.fileRepository.delete(id, actorId);

      response.id = file.id;
    } catch (error) {
      const { status, message, code } = EXCEPTION.FILE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: FileDeleteRO,
      response,
      message: 'File has been deleted successfully',
      actorId,
    });
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const fileCount = await this.fileRepository.countById(id);
    if (!fileCount) {
      const { status, message, code } = EXCEPTION.FILE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
