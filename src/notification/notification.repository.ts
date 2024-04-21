import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { NotificationEntity } from './notification.entity';
import { NotificationGetListDTO } from './dto/notification.dto';

@Injectable()
export class NotificationRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('notification')
      .where('notification.deletedAt', 'is', null)
      .where('notification.id', 'in', ids)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  update(id: number, entity: NotificationEntity) {
    return this.database
      .updateTable('notification')
      .set(entity)
      .where('notification.id', '=', id)
      .returning(['id', 'title', 'content', 'createdAt'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('notification')
      .where('notification.id', '=', id)
      .where('notification.deletedAt', 'is', null)
      .select(({ fn }) => [fn.countAll().as('count')])
      .executeTakeFirst();
    return Number(count);
  }

  insertWithTransaction(transaction: Transaction, entity: NotificationEntity) {
    return transaction.insertInto('notification').values(entity).returning(['id', 'title', 'content', 'createdAt']).executeTakeFirst();
  }

  findByCourseId(dto: NotificationGetListDTO, actorId: number) {
    const { courseId, page, limit, withRead } = dto;

    const byUser = Boolean(actorId);

    const query = this.database
      .selectFrom('notification')
      .where('notification.deletedAt', 'is', null)
      .innerJoin('courseNotification', 'courseNotification.notificationId', 'notification.id')
      .where('courseNotification.courseId', '=', courseId)
      .where('courseNotification.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'courseNotification.courseId')
      .where('course.deletedAt', 'is', null)
      .$if(byUser, (qb) =>
        qb
          .innerJoin('userNotification', 'userNotification.notificationId', 'notification.id')
          .where('userNotification.deletedAt', 'is', null)
          .innerJoin('users', 'users.id', 'userNotification.userId')
          .where('users.deletedAt', 'is', null)
          .where('users.id', '=', actorId)
          .select(['userNotification.isRead'])
          .$if(withRead, (qb) => qb.where('userNotification.isRead', '=', true)),
      )
      .orderBy('notification.createdAt', 'desc')
      .select([
        'notification.id',
        'notification.title',
        'notification.content',
        'notification.createdAt',
        'course.id as courseId',
        'course.name as courseName',
      ]);

    return paginate(query, { page, limit });
  }

  findByUserId(userId: number, dto: NotificationGetListDTO) {
    const { page, limit, withRead } = dto;

    const query = this.database
      .selectFrom('notification')
      .distinctOn(['notification.id', 'notification.createdAt'])
      .where('notification.deletedAt', 'is', null)
      .leftJoin('courseNotification', (join) =>
        join.onRef('courseNotification.notificationId', '=', 'notification.id').on('courseNotification.deletedAt', 'is', null),
      )
      .leftJoin('course', (join) => join.onRef('course.id', '=', 'courseNotification.courseId').on('course.deletedAt', 'is', null))
      .leftJoin('commentNotification', (join) =>
        join.onRef('commentNotification.notificationId', '=', 'notification.id').on('commentNotification.deletedAt', 'is', null),
      )
      .leftJoin('lessonComment', (join) =>
        join.onRef('lessonComment.id', '=', 'commentNotification.commentId').on('lessonComment.deletedAt', 'is', null),
      )
      .leftJoin('users as commentOwner', (join) =>
        join.onRef('commentOwner.id', '=', 'lessonComment.createdBy').on('commentOwner.deletedAt', 'is', null),
      )
      .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'commentOwner.id').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
      .leftJoin('studentExerciseNotification', (join) =>
        join
          .onRef('studentExerciseNotification.notificationId', '=', 'notification.id')
          .on('studentExerciseNotification.deletedAt', 'is', null),
      )
      .leftJoin('studentExercise', (join) =>
        join.onRef('studentExercise.id', '=', 'studentExerciseNotification.studentExerciseId').on('studentExercise.deletedAt', 'is', null),
      )
      .leftJoin('exercise as exerciseSubmit', (join) =>
        join.onRef('exerciseSubmit.id', '=', 'studentExercise.exerciseId').on('exerciseSubmit.deletedAt', 'is', null),
      )
      .leftJoin('assignmentSubmitNotification', (join) =>
        join
          .onRef('assignmentSubmitNotification.notificationId', '=', 'notification.id')
          .on('assignmentSubmitNotification.deletedAt', 'is', null),
      )
      .leftJoin('assignmentSubmit', (join) =>
        join
          .onRef('assignmentSubmit.id', '=', 'assignmentSubmitNotification.assignmentSubmitId')
          .on('assignmentSubmit.deletedAt', 'is', null),
      )
      .leftJoin('lessonNotification', (join) =>
        join.onRef('lessonNotification.notificationId', '=', 'notification.id').on('lessonNotification.deletedAt', 'is', null),
      )
      .leftJoin('lesson', (join) => join.onRef('lesson.id', '=', 'lessonNotification.lessonId').on('lesson.deletedAt', 'is', null))
      .leftJoin('section', (join) => join.onRef('section.id', '=', 'lesson.sectionId').on('section.deletedAt', 'is', null))
      .leftJoin('assignmentNotification', (join) =>
        join.onRef('assignmentNotification.notificationId', '=', 'notification.id').on('assignmentNotification.deletedAt', 'is', null),
      )
      .leftJoin('assignment', (join) =>
        join.onRef('assignment.id', '=', 'assignmentNotification.assignmentId').on('assignment.deletedAt', 'is', null),
      )
      .leftJoin('exerciseNotification', (join) =>
        join.onRef('exerciseNotification.notificationId', '=', 'notification.id').on('exerciseNotification.deletedAt', 'is', null),
      )
      .leftJoin('exercise', (join) =>
        join.onRef('exercise.id', '=', 'exerciseNotification.exerciseId').on('exercise.deletedAt', 'is', null),
      )
      .leftJoin('postNotification', (join) =>
        join.onRef('postNotification.notificationId', '=', 'notification.id').on('postNotification.deletedAt', 'is', null),
      )
      .innerJoin('userNotification', 'userNotification.notificationId', 'notification.id')
      .where('userNotification.userId', '=', userId)
      .where('userNotification.deletedAt', 'is', null)
      .where('userNotification.isRead', '=', withRead)
      .select([
        'notification.id',
        'notification.title',
        'notification.content',
        'notification.createdAt',
        'course.id as courseId',
        'course.name as courseName',
        'lessonComment.id as commentId',
        'lessonComment.parentId as commentParentId',
        'commentOwner.id as commentOwnerId',
        'commentOwner.displayName as commentOwnerDisplayName',
        'commentOwner.username as commentOwnerUsername',
        'image.url as commentOwnerImageUrl',
        'studentExerciseNotification.id as studentExerciseNotificationId',
        'exerciseSubmit.id as exerciseSubmitId',
        'assignmentSubmitNotification.id as assignmentSubmitNotificationId',
        'assignment.id as assignmentId',
        'assignment.name as assignmentName',
        'lessonNotification.lessonId',
        'section.id as sectionId',
        'assignmentNotification.id as assignmentNotificationId',
        'exercise.id as exerciseId',
        'exercise.name as exerciseName',
        'postNotification.id as postNotificationId',
        'postNotification.postId as postId',
      ])
      .orderBy('notification.createdAt', 'desc');

    return paginate(query, { page, limit });
  }
}
