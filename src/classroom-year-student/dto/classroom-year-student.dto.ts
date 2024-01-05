import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';
import {
  ApiArrayProperty,
  SwaggerQueryParamStyle,
} from '../../common/decorator';

export class ClassroomYearStudentBulkStoreDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  classroomYearIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];
}
