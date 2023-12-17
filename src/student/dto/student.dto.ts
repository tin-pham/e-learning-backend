import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  UserGetListDTO,
  UserStoreDTO,
  UserUpdateDTO,
} from '../../user/dto/user.dto';

export class StudentStoreDTO extends UserStoreDTO {}
export class StudentGetListDTO extends UserGetListDTO {}
export class StudentUpdateDTO extends UserUpdateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  parentId: string;
}
