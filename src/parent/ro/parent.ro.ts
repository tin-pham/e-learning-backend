import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  UserStoreRO,
  UserGetDetailRO,
  UserUpdateRO,
  UserDeleteRO,
  UserGetListDataRO,
} from '../../user/ro/user.ro';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ParentStoreRO extends PickType(UserStoreRO, [
  'id',
  'username',
  'displayName',
  'phone',
] as const) {}

export class ParentGetListDataRO extends PickType(UserGetListDataRO, [
  'id',
  'username',
  'displayName',
  'phone',
] as const) {}

export class ParentGetListRO extends PaginateRO<ParentGetListDataRO> {
  @ApiProperty({ type: [ParentGetListDataRO] })
  @Type(() => ParentGetListDataRO)
  @Expose()
  data: ParentGetListDataRO[];
}

export class ParentGetDetailRO extends PickType(UserGetDetailRO, [
  'id',
  'username',
  'displayName',
  'phone',
] as const) {}

export class ParentUpdateRO extends PickType(UserUpdateRO, [
  'id',
  'username',
  'displayName',
  'phone',
] as const) {}

export class ParentDeleteRO extends UserDeleteRO {}
