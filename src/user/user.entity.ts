import { RoleEntity } from '../role/role.entity';

export class UserEntity {
  id!: string;

  username: string;

  password: string;

  email?: string;

  phone?: string;

  displayName: string;

  createdAt!: Date;

  createdBy!: string;

  updatedAt?: Date;

  updatedBy?: string;

  deletedAt?: Date;

  deletedBy?: string;

  roles: RoleEntity[];
}
