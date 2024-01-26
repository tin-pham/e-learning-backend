import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class CourseAssignmentBulkStoreDTO {
  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  courseIds: number[];

  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  assignmentIds: number[];
}

export class CourseAssignmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  courseIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  assignmentIds: number[];
}
