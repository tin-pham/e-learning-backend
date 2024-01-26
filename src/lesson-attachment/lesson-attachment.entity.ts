import { BaseEntity } from '../base/base.entity';

export class LessonAttachmentEntity extends BaseEntity {
  url: string;

  lessonId: number;

  constructor(data?: Partial<LessonAttachmentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
