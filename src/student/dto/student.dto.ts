import {
  UserGetListDTO,
  UserStoreDTO,
  UserUpdateDTO,
} from '../../user/dto/user.dto';

export class StudentStoreDTO extends UserStoreDTO {}
export class StudentGetListDTO extends UserGetListDTO {}
export class StudentUpdateDTO extends UserUpdateDTO {}
