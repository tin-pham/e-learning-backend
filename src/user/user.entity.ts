export class UserEntity {
  id!: string;

  username: string;

  password: string;

  email?: string;

  phone?: string;

  displayName: string;

  createdAt!: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
