import * as bcrypt from 'bcryptjs';

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

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
