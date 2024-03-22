import { BaseEntity } from '../base/base.entity';

export class LessonEntity extends BaseEntity {
  title: string;

  body?: object;

  sectionId: number;

  videoId?: number;

  constructor(data?: Partial<LessonEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
