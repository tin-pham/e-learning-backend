import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from 'src/common/decorator';

export class ExerciseQuestionBulkStoreDTO {
  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  exerciseIds: number[];

  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  questionIds: number[];
}

export class ExerciseQuestionBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  exerciseIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  questionIds: number[];
}
