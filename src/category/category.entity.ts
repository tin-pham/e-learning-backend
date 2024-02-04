import { BaseEntity } from '../base/base.entity';

export class CategoryEntity extends BaseEntity {
  name: string;

  description: string;

  constructor(data?: CategoryEntity) {
    super(data);
    Object.assign(this, data);
  }
}
