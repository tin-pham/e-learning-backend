import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { CategoryRepository } from '../category/category.repository';
import { CourseRepository } from '../course/course.repository';
import { CategoryCourseRepository } from './category-course.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CategoryCourseDeleteDTO } from './dto/category-course.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class CategoryCourseService extends BaseService {
  private readonly logger = new Logger(CategoryCourseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly categoryRepository: CategoryRepository,
    private readonly courseRepository: CourseRepository,
    private readonly categoryCourseRepository: CategoryCourseRepository,
  ) {
    super(elasticLogger);
  }

  async delete(dto: CategoryCourseDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(dto, actorId);

    try {
      await this.categoryCourseRepository.deleteByCategoryIdAndCourseId(dto.categoryId, dto.courseId, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.CATEGORY_COURSE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Category course deleted successfully',
      actorId,
    });
  }

  private async validateDelete(dto: CategoryCourseDeleteDTO, actorId: number) {
    // Check category exist
    const categoryCount = await this.categoryRepository.countById(dto.categoryId);
    if (!categoryCount) {
      const { code, status, message } = EXCEPTION.CATEGORY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check category course exist
    const categoryCourseCount = await this.categoryCourseRepository.countByCategoryIdAndCourseId(dto.categoryId, dto.courseId);
    if (!categoryCourseCount) {
      const { code, status, message } = EXCEPTION.CATEGORY_COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
