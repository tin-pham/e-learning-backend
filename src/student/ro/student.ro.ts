import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  UserGetListRO,
  UserStoreRO,
  UserGetDetailRO,
  UserUpdateRO,
} from '../../user/ro/user.ro';

export class StudentStoreRO extends UserStoreRO {}
export class StudentGetListRO extends UserGetListRO {}

export class StudentGetDetailRO extends UserGetDetailRO {
  @ApiProperty()
  @Expose()
  userId: string;
}

export class StudentUpdateRO extends UserUpdateRO {
  @ApiProperty()
  @Expose()
  userId: string;
}
