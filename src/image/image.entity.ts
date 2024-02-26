import { BaseEntity } from '../base/base.entity';

export class ImageEntity extends BaseEntity {
  url: string;

  name: string;

  type: string;

  size: string;

  constructor(data?: ImageEntity) {
    super(data);
    Object.assign(this, data);
  }
}
