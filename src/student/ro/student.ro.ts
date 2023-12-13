import {
  UserGetListRO,
  UserStoreRO,
  UserGetDetailRO,
  UserUpdateRO,
} from '../../user/ro/user.ro';

export class StudentStoreRO extends UserStoreRO {}
export class StudentGetListRO extends UserGetListRO {}

export class StudentGetDetailRO extends UserGetDetailRO {}
export class StudentUpdateRO extends UserUpdateRO {}
