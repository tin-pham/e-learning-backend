import { BaseEntity } from '../base/base.entity';

export class LessonFileEntity extends BaseEntity {
  lessonId: number;

  fileId: number;

  constructor(data?: Partial<LessonFileEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
