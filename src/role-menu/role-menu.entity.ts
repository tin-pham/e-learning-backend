import { BaseEntity } from '../base/base.entity';

export class RoleMenuEntity extends BaseEntity {
  roleId: number;

  menuId: number;

  constructor(data: Partial<RoleMenuEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
