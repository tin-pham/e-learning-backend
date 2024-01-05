import type { UserEntity } from '../user';

export class ParentEntity {
  id: string;

  userId: number;

  user?: UserEntity;
}
