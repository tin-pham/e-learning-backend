import { BaseEntity } from '../base/base.entity';

export class PostEntity extends BaseEntity {
  title: string;
  content: object;

  constructor(data?: PostEntity) {
    super(data);
    Object.assign(this, data);
  }
}
