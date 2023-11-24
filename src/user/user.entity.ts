import { Generated } from 'kysely';

export class UserEntity {
  id!: Generated<string>;

  username: string;

  password: string;

  email?: string;

  phone?: string;

  displayName: string;

  createdAt!: Generated<Date>;

  updatedAt?: Date;

  deletedAt?: Date;
}
