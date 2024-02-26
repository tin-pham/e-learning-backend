import { BaseEntity } from '../base/base.entity';
import { RoleEntity } from '../role/role.entity';

export class UserEntity extends BaseEntity {
  username: string;

  password?: string;

  email?: string;

  phone?: string;

  displayName: string;

  roles?: RoleEntity[];
}
