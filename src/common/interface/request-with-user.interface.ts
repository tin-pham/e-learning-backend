import { Request } from 'express';
import { UserEntity } from '../../user/user.entity';

export interface IRequestWithUser extends Request {
  user: UserEntity;
}
