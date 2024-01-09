import { BaseEntity } from '../base/base.entity';

export class MenuEntity extends BaseEntity {
  name: string;

  route: string;

  parentId?: number;

  constructor(data?: Partial<MenuEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
