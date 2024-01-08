import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ArrayMinSize, IsArray, IsOptional, IsNumber } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class TeacherSubjectBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  teacherIds: string[];

  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: number[];
}

export class TeacherSubjectGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  classroomYearId?: number;
}
