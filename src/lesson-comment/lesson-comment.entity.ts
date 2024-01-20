import { BaseEntity } from '../base/base.entity';

export class LessonCommentEntity extends BaseEntity {
  lessonId: number;

  body: string;

  parentId?: number;

  constructor(data?: Partial<LessonCommentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
