import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { VideoEntity } from './video.entity';
import { VideoRepository } from './video.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { VideoStoreDTO } from './dto/video.dto';
import { VideoDeleteRO, VideoStoreRO } from './ro/video.ro';

@Injectable()
export class VideoService extends BaseService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly videoRepository: VideoRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: VideoStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    const response = new VideoStoreRO();

    try {
      const videoData = new VideoEntity();
      videoData.url = dto.url;
      videoData.createdBy = actorId;

      const video = await this.videoRepository.insert(videoData);

      response.id = video.id;
      response.url = video.url;
    } catch (error) {
      const { code, status, message } = EXCEPTION.VIDEO.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: VideoStoreRO,
      response,
      message: 'Video stored successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new VideoDeleteRO();

    try {
      const video = await this.videoRepository.delete(id, actorId);
      response.id = video.id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.VIDEO.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
    return this.success({
      classRO: VideoDeleteRO,
      response,
      message: 'Video deleted successfully',
      actorId,
    });
  }

  private async validateDelete(id: number, actorId: number) {
    // check exist
    const videoCount = await this.videoRepository.countById(id);
    if (!videoCount) {
      const { code, status, message } = EXCEPTION.VIDEO.DELETE_FAILED;
      this.throwException({ code, status, message, actorId });
    }
  }
}
