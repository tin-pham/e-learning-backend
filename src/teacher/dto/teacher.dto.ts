import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { UserGetListDTO, UserStoreDTO, UserUpdateDTO } from '../../user/dto/user.dto';

export class TeacherStoreDTO extends UserStoreDTO {}
export class TeacherGetListDTO extends UserGetListDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  subjectId: number;
}
export class TeacherUpdateDTO extends UserUpdateDTO {}
