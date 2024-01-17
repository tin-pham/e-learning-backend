import { BaseEntity } from '../base/base.entity';

export class VideoEntity extends BaseEntity {
  url: string;

  lessonId: number;

  constructor(data?: Partial<VideoEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
