import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class ExerciseSubmitStoreQuestionDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  optionIds: number[];
}

export class ExerciseSubmitStoreDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  exerciseId: number;

  @ApiProperty({ type: [ExerciseSubmitStoreQuestionDTO] })
  @Type(() => ExerciseSubmitStoreQuestionDTO)
  questions: ExerciseSubmitStoreQuestionDTO[];
}

export class ExerciseSubmitGetListDTO extends PaginateDTO {}
