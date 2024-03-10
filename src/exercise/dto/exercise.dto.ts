import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { NAME, DIFFICULTY_ID, LESSON_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.EXERCISE;

export class ExerciseStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({
    message: DIFFICULTY_ID.IS_NOT_EMPTY,
  })
  difficultyId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsNotEmpty({
    message: LESSON_ID.IS_NOT_EMPTY,
  })
  lessonId: number;
}

export class ExerciseGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;
}

export class ExerciseUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}
