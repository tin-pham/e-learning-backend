import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { DirectoryRepository } from './directory.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { DirectoryGetListDTO, DirectoryStoreDTO, DirectoryUpdateDTO } from './dto/directory.dto';
import { DirectoryEntity } from './directory.entity';
import { DirectoryDeleteRO, DirectoryGetListRO, DirectoryStoreRO, DirectoryUpdateRO } from './ro/directory.ro';

@Injectable()
export class DirectoryService extends BaseService {
  private readonly logger = new Logger(DirectoryService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly directoryRepository: DirectoryRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: DirectoryStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: DirectoryStoreRO;

    try {
      const directoryData = new DirectoryEntity({
        name: dto.name,
        parentId: dto.parentId,
      });

      const directory = await this.directoryRepository.insert(directoryData, actorId);

      response = new DirectoryStoreRO({
        id: directory.id,
        name: directory.name,
        parentId: directory.parentId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.DIRECTORY.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: DirectoryStoreRO,
      response,
      message: 'Directory has been stored successfully',
      actorId,
    });
  }

  async getList(dto: DirectoryGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const directories = await this.directoryRepository.find(dto);

      const response = new DirectoryGetListRO({
        data: directories,
      });

      return this.success({
        classRO: DirectoryGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.DIRECTORY.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async update(id: number, dto: DirectoryUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    let response: DirectoryUpdateRO;

    try {
      const directoryData = new DirectoryEntity({
        name: dto.name,
      });

      const directory = await this.directoryRepository.update(id, directoryData, actorId);

      response = new DirectoryUpdateRO({
        id: directory.id,
        name: directory.name,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.DIRECTORY.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: DirectoryUpdateRO,
      response,
      message: 'Directory has been updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);
    let response: DirectoryDeleteRO;
    try {
      await this.database.transaction().execute(async (transaction) => {
        const directoryIds = await this.directoryRepository.getRecursiveIds(id);
        const ids = directoryIds.map((directory) => directory.id);

        // Delete directory
        await this.directoryRepository.deleteMultipleByIdsByTransaction(transaction, ids, actorId);

        // Delete attachment metadata
        await this.attachmentRepository.deleteMultipleByDirectoryIdsByTransaction(transaction, ids);

        // Delete attachment
        const attachments = await this.attachmentRepository.getPathsByDirectoryIds(ids);
        const paths = attachments.map((attachment) => attachment.path);
        for (const path of paths) {
          await unlink(path);
        }
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.DIRECTORY.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: DirectoryDeleteRO,
      response,
      message: 'Directory has been deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: DirectoryStoreDTO, actorId: number) {
    // Check name unique same parent
    const directoryCount = await this.directoryRepository.countByNameAndParentId(dto.name, dto.parentId);
    if (directoryCount) {
      const { code, status, message } = EXCEPTION.DIRECTORY.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: DirectoryUpdateDTO, actorId: number) {
    // Check exist
    const directory = await this.directoryRepository.getParentIdById(id);
    if (!directory) {
      const { code, status, message } = EXCEPTION.DIRECTORY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name unique same parent except id
    const directoryCountExceptId = await this.directoryRepository.countByNameAndParentIdExceptId(dto.name, directory.parentId, id);
    if (directoryCountExceptId) {
      const { code, status, message } = EXCEPTION.DIRECTORY.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const directoryCount = await this.directoryRepository.countById(id);
    if (!directoryCount) {
      const { code, status, message } = EXCEPTION.DIRECTORY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
