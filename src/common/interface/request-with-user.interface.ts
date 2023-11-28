import { UserEntity } from '../../user/user.entity';

export interface IRequestWithUser {
  user: UserEntity;
}
