import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import {
  ApiArrayProperty,
  SwaggerQueryParamStyle,
} from '../../common/decorator';

export class SubjectGroupBulkStoreDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  groupIds: number[];
}

export class SubjectGroupBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  subjectIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) =>
    Number.parseInt(value),
  )
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  groupIds: number[];
}
