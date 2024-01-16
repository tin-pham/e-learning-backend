import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { VideoRepository } from './video.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { VideoBulkDeleteDTO, VideoGetListDTO, VideoUploadDTO } from './dto/video.dto';
import { ResultRO } from '../common/ro/result.ro';
import { VideoGetListRO, VideoUploadRO } from './ro/video.ro';
import { VideoEntity } from './video.entity';

@Injectable()
export class VideoService extends BaseService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly videoRepository: VideoRepository,
  ) {
    super(elasticLogger);
  }

  async upload(dto: VideoUploadDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    const response = new VideoUploadRO();

    try {
      const videoData = new VideoEntity({
        name: dto.video.originalName,
        path: dto.video.path,
        mimeType: dto.video['busBoyMimeType']
      });

      const video = await this.videoRepository.insert(videoData);

      response.id = video.id;
      response.name = video.name;
      response.path = video.path;
      response.mimeType = video.mimeType;
    } catch (error) {
      const { status, message, code } = EXCEPTION.VIDEO.UPLOAD_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: VideoUploadRO,
      response,
      message: 'Video has been uploaded successfully',
      actorId,
    });
  }

  async bulkDelete(dto: VideoBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(dto, actorId);

    try {
      await this.videoRepository.deleteMultipleByIds(dto.ids);
    } catch (error) {
      const { status, message, code } = EXCEPTION.VIDEO.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Videos has been deleted successfully',
      actorId,
    });
  }

  async getList(dto: VideoGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.videoRepository.find(dto);

      return this.success({
        classRO: VideoGetListRO,
        response,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.VIDEO.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(dto: VideoBulkDeleteDTO, actorId: number) {
    // Check exist
    const videoCount = await this.videoRepository.countByIds(dto.ids);
    if (videoCount !== dto.ids.length) {
      const { status, message, code } = EXCEPTION.VIDEO.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
