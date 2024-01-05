import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  UserGetListDTO,
  UserStoreDTO,
  UserUpdateDTO,
} from '../../user/dto/user.dto';
import { IsOptional, IsString } from 'class-validator';

export class StudentStoreDTO extends UserStoreDTO {}
export class StudentGetListDTO extends UserGetListDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  classroomYearId?: number;
}
export class StudentUpdateDTO extends UserUpdateDTO {}
