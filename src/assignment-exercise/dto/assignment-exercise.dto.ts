import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class AssignmentExerciseStoreDTO {
  @ApiProperty({ example: [1] })
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsArray()
  assignmentIds: number[];

  @ApiProperty({ example: [1] })
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsArray()
  exerciseIds: number[];
}

export class AssignmentExerciseDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  assignmentIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  exerciseIds: number[];
}
