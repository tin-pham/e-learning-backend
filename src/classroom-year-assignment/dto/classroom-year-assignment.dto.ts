import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import {
  ApiArrayProperty,
  SwaggerQueryParamStyle,
} from '../../common/decorator';

export class ClassroomYearAssignmentBulkStoreDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  classroomYearIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  teacherSubjectIds: number[];
}
