import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { PostEntity } from './post.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { PostRepository } from './post.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CourseRepository } from '../course/course.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { PostNotificationRepository } from '../post-notification/post-notification.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { PostGetListDTO, PostStoreDTO, PostUpdateDTO } from './dto/post.dto';
import { PostGetListRO, PostStoreRO } from './ro/post.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class PostService extends BaseService {
  private readonly logger = new Logger();

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly postRepository: PostRepository,
    private readonly courseRepository: CourseRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly courseNotificationRepository: CourseNotificationRepository,
    private readonly postNotificationRepository: PostNotificationRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: PostStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { course } = await this.validateStore(dto, actorId);

    const response = new PostStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store post
        const postData = new PostEntity();
        postData.content = dto.content;
        postData.courseId = dto.courseId;
        postData.createdBy = actorId;

        const post = await this.postRepository.insertWithTransaction(transaction, postData);

        // Store notification
        const notificationData = new NotificationEntity({
          title: 'THÔNG BÁO MỚI',
          content: `Khóa học ${course.name} có thông báo mới`,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        // Notify for who inside the course
        await this.courseNotificationRepository.insertWithTransaction(transaction, {
          courseId: dto.courseId,
          notificationId: notification.id,
        });

        // Keep post id for direction
        await this.postNotificationRepository.insertWithTransaction(transaction, {
          postId: post.id,
          notificationId: notification.id,
        });

        // Keep is read for each user
        const courseStudents = await this.courseStudentRepository.getStudentIdsByCourseId(dto.courseId);

        let users: { id: number }[] = [];
        if (courseStudents.length) {
          const studentIds = courseStudents.map((courseStudent) => courseStudent.studentId);
          users = await this.studentRepository.getUserIdsByStudentIds(studentIds);

          const userNotificationData = users.map(
            (user) =>
              new UserNotificationEntity({
                userId: user.id,
                notificationId: notification.id,
              }),
          );
          await this.userNotificationRepository.insertMultipleWithTransaction(transaction, userNotificationData);
        }

        response.id = post.id;
        response.courseId = post.courseId;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: PostStoreRO,
      response,
      message: 'Post created successfully',
      actorId,
    });
  }

  async update(id: number, dto: PostUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    try {
      const postData = new PostEntity();
      postData.updatedBy = actorId;
      postData.updatedAt = new Date();
      if (dto.content) {
        postData.content = dto.content;
      }

      await this.postRepository.update(id, postData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Post updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      await this.postRepository.delete(id, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Post deleted successfully',
      actorId,
    });
  }

  async getList(dto: PostGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const posts = await this.postRepository.find(dto);

      return this.success({
        classRO: PostGetListRO,
        response: posts,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let response: any;

    try {
      response = await this.postRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.POST.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: PostGetDetailRO,
      response,
    });
  }

  private async validateStore(dto: PostStoreDTO, actorId: number) {
    // Check post exist
    const course = await this.courseRepository.getNameById(dto.courseId);
    if (!course) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { course };
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check post exist
    const postCount = await this.postRepository.countById(id);
    if (!postCount) {
      const { code, status, message } = EXCEPTION.POST.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check post exist
    const postCount = await this.postRepository.countById(id);
    if (!postCount) {
      const { code, status, message } = EXCEPTION.POST.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
