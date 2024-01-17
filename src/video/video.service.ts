import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { VideoEntity } from './video.entity';
import { VideoRepository } from './video.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { VideoStoreDTO } from './dto/video.dto';
import { VideoDeleteRO, VideoGetDetailRO, VideoStoreRO } from './ro/video.ro';

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
    let response: VideoStoreRO;
    try {
      const videoData = new VideoEntity({ url: dto.url, lessonId: dto.lessonId, createdBy: actorId });
      const video = await this.videoRepository.insert(videoData);

      response = new VideoStoreRO({
        id: video.id,
        url: video.url,
        lessonId: video.lessonId,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.VIDEO.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: VideoStoreRO,
      response,
      message: 'Successfully store video',
      actorId,
    });
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let video: VideoEntity;

    try {
      video = await this.videoRepository.findOneById(id);
    } catch (error) {
      const { status, message, code } = EXCEPTION.VIDEO.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    if (!video) {
      const { status, message, code } = EXCEPTION.VIDEO.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }

    const response = new VideoGetDetailRO({
      id: video.id,
      url: video.url,
      lessonId: video.lessonId,
    });

    return this.success({
      classRO: VideoGetDetailRO,
      response,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    let response: VideoDeleteRO;

    try {
      const video = await this.videoRepository.delete(id, actorId);

      response = new VideoDeleteRO({
        id: video.id,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.VIDEO.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: VideoDeleteRO,
      response,
      message: 'Successfully delete video',
      actorId,
    });
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const videoCount = await this.videoRepository.countById(id);
    if (!videoCount) {
      const { status, message, code } = EXCEPTION.VIDEO.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
