import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class TeacherSubjectBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  teacherIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: string[];
}

export class TeacherSubjectGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  classroomYearId?: string;
}
