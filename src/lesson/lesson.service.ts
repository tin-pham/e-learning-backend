import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { ROLE } from '../role/enum/role.enum';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonEntity } from './lesson.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonGetListDTO, LessonStoreDTO, LessonUpdateDTO } from './dto/lesson.dto';
import { LessonRepository } from './lesson.repository';
import { SectionRepository } from '../section/section.repository';
import { LessonDeleteRO, LessonGetDetailRO, LessonGetListRO, LessonStoreRO, LessonUpdateRO } from './ro/lesson.ro';
import { StudentRepository } from 'src/student/student.repository';
import { CourseStudentRepository } from 'src/course-student/course-student.repository';

@Injectable()
export class LessonService extends BaseService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonRepository: LessonRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly studentRepository: StudentRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: LessonStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);
    const response = new LessonStoreRO();

    try {
      const lessonData = new LessonEntity({
        title: dto.title,
        body: dto.body,
        sectionId: dto.sectionId,
        videoUrl: dto.videoUrl,
        createdBy: actorId,
      });

      const lesson = await this.lessonRepository.insert(lessonData);

      response.id = lesson.id;
      response.title = lesson.title;
      response.body = lesson.body;
      response.sectionId = lesson.sectionId;
      response.videoUrl = lesson.videoUrl;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonStoreRO,
      response,
      message: 'Lesson has been stored successfully',
      actorId,
    });
  }

  async getList(dto: LessonGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.lessonRepository.find(dto);

      return this.success({
        classRO: LessonGetListRO,
        response,
        message: 'Get lesson list successfully',
        actorId,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const { roles, userId: actorId } = decoded;

    let response: any;

    // Is student register to this course
    if (roles.includes(ROLE.STUDENT)) {
      const student = await this.studentRepository.getStudentIdByUserId(actorId);
      const courseStudent = await this.courseStudentRepository.countByCourseIdAndStudentId(id, student.id);

      if (!courseStudent) {
        const { status, message, code } = EXCEPTION.COURSE_STUDENT.NOT_REGISTERED;
        this.throwException({ status, message, code, actorId });
      }
    }

    try {
      response = await this.lessonRepository.findOneById(id);
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    if (!response) {
      const { status, message, code } = EXCEPTION.LESSON.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonGetDetailRO,
      response,
      message: 'Get lesson detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: LessonUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    const response = new LessonUpdateRO();

    try {
      const lessonData = new LessonEntity();
      lessonData.updatedBy = actorId;
      if (dto.title) {
        lessonData.title = dto.title;
      }

      if (dto.body) {
        lessonData.body = dto.body;
      }

      if (dto.videoUrl) {
        lessonData.videoUrl = dto.videoUrl;
      }

      const lesson = await this.lessonRepository.update(id, lessonData);

      response.id = lesson.id;
      response.title = lesson.title;
      response.body = lesson.body;
      response.videoUrl = lesson.videoUrl;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonUpdateRO,
      response,
      message: 'Lesson has been updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new LessonDeleteRO();

    try {
      const lesson = await this.lessonRepository.delete(id, actorId);
      response.id = lesson.id;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonDeleteRO,
      response,
      message: 'Lesson has been deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: LessonStoreDTO, actorId: number) {
    // Check section exist
    const sectionCount = await this.sectionRepository.countById(dto.sectionId);
    if (!sectionCount) {
      const { status, message, code } = EXCEPTION.SECTION.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const lessonCount = await this.lessonRepository.countById(id);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const lessonCount = await this.lessonRepository.countById(id);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
