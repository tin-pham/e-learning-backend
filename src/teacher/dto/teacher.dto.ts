import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  UserGetListDTO,
  UserStoreDTO,
  UserUpdateDTO,
} from '../../user/dto/user.dto';

export class TeacherStoreDTO extends UserStoreDTO {}
export class TeacherGetListDTO extends UserGetListDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subjectId: string;
}
export class TeacherUpdateDTO extends UserUpdateDTO {}
