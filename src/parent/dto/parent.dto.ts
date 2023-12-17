import { PickType } from '@nestjs/swagger';
import {
  UserGetListDTO,
  UserStoreDTO,
  UserUpdateDTO,
} from '../../user/dto/user.dto';

export class ParentStoreDTO extends PickType(UserStoreDTO, [
  'username',
  'password',
  'phone',
  'displayName',
] as const) {}
export class ParentGetListDTO extends UserGetListDTO {}
export class ParentUpdateDTO extends PickType(UserUpdateDTO, [
  'phone',
  'displayName',
  'password',
] as const) {}
