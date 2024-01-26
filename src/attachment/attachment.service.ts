import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ROOT_DIRECTORY_ID } from '../directory/enum/directory.enum';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AttachmentRepository } from './attachment.repository';
import { DirectoryRepository } from '../directory/directory.repository';
import { AttachmentEntity } from './attachment.entity';
import { AttachmentBulkDeleteDTO, AttachmentGetListDTO, AttachmentUploadDTO } from './dto/attachment.dto';
import { AttachmentGetListRO } from './ro/attachment.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class AttachmentService extends BaseService {
  private readonly logger = new Logger(AttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly directoryRepository: DirectoryRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async upload(files: Array<Express.Multer.File>, dto: AttachmentUploadDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpload(dto, actorId);

    try {
      for (const file of files) {
        const attachmentData = new AttachmentEntity({
          name: file.originalname,
          path: file.path,
          mimeType: file.mimetype,
          directoryId: dto.directoryId || ROOT_DIRECTORY_ID,
        });

        await this.attachmentRepository.insert(attachmentData);
      }
    } catch (error) {
      const { status, message, code } = EXCEPTION.ATTACHMENT.UPLOAD_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Attachment has been uploaded successfully',
      actorId,
    });
  }

  async bulkDelete(dto: AttachmentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(dto, actorId);

    try {
      // Get paths
      const attachments = await this.attachmentRepository.getPaths();

      // Delete attachments
      for (const attachment of attachments) {
        await unlink(attachment.path);
      }

      // Delete metadata
      await this.attachmentRepository.deleteMultipleByIds(dto.ids);
    } catch (error) {
      const { status, message, code } = EXCEPTION.ATTACHMENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Attachment has been deleted successfully',
      actorId,
    });
  }

  async getList(dto: AttachmentGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.attachmentRepository.find(dto);

      return this.success({
        classRO: AttachmentGetListRO,
        response,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.ATTACHMENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { attachment } = await this.validateGetDetail(id, actorId);

    const startIndex = attachment.path.indexOf('/data/attachments');
    const adjustedPath = attachment.path.slice(startIndex);
    const stream = createReadStream(adjustedPath);

    return new StreamableFile(stream, {
      disposition: `inline; filename="${attachment.name}"`,
      type: attachment.mimeType,
    });
  }

  private async validateUpload(dto: AttachmentUploadDTO, actorId: number) {
    // Check directory exist
    if (dto.directoryId) {
      const directoryCount = await this.directoryRepository.countById(dto.directoryId);
      if (!directoryCount) {
        const { status, message, code } = EXCEPTION.DIRECTORY.DOES_NOT_EXIST;
        this.throwException({ status, message, code, actorId });
      }
    }
  }

  private async validateGetDetail(id: number, actorId: number) {
    // Check exist
    const attachment = await this.attachmentRepository.findOneById(id);
    if (!attachment) {
      const { status, message, code } = EXCEPTION.ATTACHMENT.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }
    return { attachment };
  }

  private async validateDelete(dto: AttachmentBulkDeleteDTO, actorId: number) {
    // Check exist
    const attachmentCount = await this.attachmentRepository.countByIds(dto.ids);
    if (attachmentCount !== dto.ids.length) {
      const { status, message, code } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
