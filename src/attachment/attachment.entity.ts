import { BaseEntity } from '../base/base.entity';

export class AttachmentEntity extends BaseEntity {
  name: string;

  path: string;

  mimeType: string;

  directoryId: number;

  constructor(data?: AttachmentEntity) {
    super(data);
    Object.assign(this, data);
  }
}
