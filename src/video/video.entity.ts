import { BaseEntity } from '../base/base.entity';

export class VideoEntity extends BaseEntity {
  name: string;

  path: string;

  mimeType: string;

  constructor(data?: Partial<VideoEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
