import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClassroomYearUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  formTeacherId?: string;
}
