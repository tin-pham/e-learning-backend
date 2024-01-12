import { BaseEntity } from '../base/base.entity';

export class LessonVideoEntity extends BaseEntity {
  lessonId: number;

  videoId: number;

  constructor(data?: Partial<LessonVideoEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
