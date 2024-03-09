import { BaseEntity } from '../base/base.entity';

export class UserImageEntity extends BaseEntity {
  userId: number;
  imageId: number;

  constructor(data?: UserImageEntity) {
    super(data);
    Object.assign(this, data);
  }
}
