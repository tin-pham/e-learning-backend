import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';
import {
  ApiArrayProperty,
  SwaggerQueryParamStyle,
} from '../../common/decorator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class TeacherSubjectBulkStoreDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  teacherIds: string[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
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
