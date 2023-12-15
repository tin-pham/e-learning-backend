import {
  UserGetListRO,
  UserStoreRO,
  UserGetDetailRO,
  UserUpdateRO,
  UserDeleteRO,
} from '../../user/ro/user.ro';

export class TeacherStoreRO extends UserStoreRO {}
export class TeacherGetListRO extends UserGetListRO {}
export class TeacherGetDetailRO extends UserGetDetailRO {}
export class TeacherUpdateRO extends UserUpdateRO {}
export class TeacherDeleteRO extends UserDeleteRO {}
