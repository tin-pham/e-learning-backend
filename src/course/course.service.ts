import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { CourseEntity } from './course.entity';
import { CourseRepository } from './course.repository';
import { SectionRepository } from '../section/section.repository';
import { CategoryRepository } from '../category/category.repository';
import { CategoryCourseRepository } from '../category-course/category-course.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { DatabaseService } from '../database/database.service';
import { CourseGetDetailDTO, CourseGetListDTO, CourseStoreDTO, CourseUpdateDTO } from './dto/course.dto';
import { CourseDeleteRO, CourseGetDetailRO, CourseGetListRO, CourseStoreRO, CourseUpdateRO } from './ro/course.ro';
import { StudentRepository } from 'src/student/student.repository';

@Injectable()
export class CourseService extends BaseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly courseRepository: CourseRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryCourseRepository: CategoryCourseRepository,
    private readonly attachmentRepository: AttachmentRepository,
    private readonly studentRepository: StudentRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: CourseStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new CourseStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store course
        const courseData = new CourseEntity();
        courseData.name = dto.name;
        courseData.description = dto.description;
        courseData.imageId = dto.imageId;
        courseData.createdBy = actorId;
        const course = await this.courseRepository.insertWithTransaction(transaction, courseData);
        // Store category

        if (dto.categoryIds) {
          await this.categoryCourseRepository.insertByCategoryIdsAndCourseIdWithTransaction(
            transaction,
            dto.categoryIds,
            course.id,
            actorId,
          );
        }

        response.id = course.id;
        response.name = course.name;
        response.description = course.description;
        response.imageId = course.imageId;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseStoreRO,
      response,
      message: 'Store course successfully',
      actorId,
    });
  }

  async getList(dto: CourseGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.validateGetList(dto, actorId);

    try {
      let response: any;

      if (student) {
        response = await this.courseRepository.findByStudentId(student.id, dto);
      } else {
        response = await this.courseRepository.find(dto);
      }

      return this.success({
        classRO: CourseGetListRO,
        response,
        message: 'Get list course successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, dto: CourseGetDetailDTO, decoded: IJwtPayload) {
    const { userId: actorId } = decoded;

    let response: any;

    try {
      response = await this.courseRepository.findOneById(id, dto);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.COURSE.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseGetDetailRO,
      response,
    });
  }

  async update(id: number, dto: CourseUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new CourseUpdateRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        const courseData = new CourseEntity();
        courseData.updatedBy = actorId;
        courseData.updatedAt = new Date();
        if (dto.name) {
          courseData.name = dto.name;
        }

        if (dto.description) {
          courseData.description = dto.description;
        }

        if (dto.imageId) {
          courseData.imageId = dto.imageId;
        }

        const course = await this.courseRepository.updateWithTransaction(transaction, id, courseData);

        await this.categoryCourseRepository.updateByCategoryIdsAndCourseIdWithTransaction(transaction, dto.categoryIds, course.id, actorId);

        response.id = course.id;
        response.name = course.name;
        response.imageId = course.imageId;
        response.description = course.description;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseUpdateRO,
      response,
      message: 'Update course successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new CourseDeleteRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete course
        const course = await this.courseRepository.deleteWithTransaction(transaction, id, actorId);

        // Delete section
        await this.sectionRepository.deleteMultipleByCourseIdWithTransaction(transaction, id, actorId);

        // Set response
        response.id = course.id;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseDeleteRO,
      response,
      message: 'Delete course successfully',
      actorId,
    });
  }

  private async validateStore(dto: CourseStoreDTO, actorId: number) {
    // Check name exist
    const nameCount = await this.courseRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.COURSE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check category exist
    if (dto.categoryIds) {
      const categoryCount = await this.categoryRepository.countByIds(dto.categoryIds);
      if (!categoryCount) {
        const { code, status, message } = EXCEPTION.CATEGORY.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    // Check image exist
    if (dto.imageId) {
      const imageCount = await this.attachmentRepository.countById(dto.imageId);
      if (!imageCount) {
        const { code, status, message } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateUpdate(id: number, dto: CourseUpdateDTO, actorId: number) {
    // Check exist
    const courseCount = await this.courseRepository.countById(id);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name exist except id
    const nameCount = await this.courseRepository.countByNameExceptId(dto.name, id);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.COURSE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check add category exist
    if (dto.categoryIds && dto.categoryIds.length) {
      const categoryCount = await this.categoryRepository.countByIds(dto.categoryIds);
      if (!categoryCount) {
        const { code, status, message } = EXCEPTION.CATEGORY.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    if (dto.imageId) {
      const imageCount = await this.attachmentRepository.countById(dto.imageId);
      if (!imageCount) {
        const { code, status, message } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const courseCount = await this.courseRepository.countById(id);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateGetList(dto: CourseGetListDTO, actorId: number) {
    // Check is user student
    let student: any;
    if (dto.userId) {
      student = await this.studentRepository.getStudentIdByUserId(dto.userId);
      if (!student) {
        const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    return { student };
  }
}
