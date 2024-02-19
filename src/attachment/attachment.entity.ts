import { BaseEntity } from '../base/base.entity';

export class AttachmentEntity extends BaseEntity {
  url: string;

  name: string;

  type: string;

  size: string;

  lessonId?: number;

  assignmentId?: number;

  constructor(data?: Partial<AttachmentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
