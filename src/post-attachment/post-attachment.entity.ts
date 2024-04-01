import { BaseEntity } from '../base/base.entity';

export class PostAttachmentEntity extends BaseEntity {
  postId: number;
  attachmentId: number;

  constructor(data?: PostAttachmentEntity) {
    super(data);
    Object.assign(this, data);
  }
}
