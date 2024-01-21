import { BaseEntity } from '../base/base.entity';

export class DirectoryEntity extends BaseEntity {
  name: string;

  parentId?: number;

  constructor(data?: DirectoryEntity) {
    super(data);
    Object.assign(this, data);
  }
}
