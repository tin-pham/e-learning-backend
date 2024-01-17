import { BaseEntity } from '../base/base.entity';

export class LessonAttachmentEntity extends BaseEntity {
  lessonId: number;

  attachmentId: number;

  constructor(data?: Partial<LessonAttachmentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
