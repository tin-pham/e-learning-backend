import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

const { NAME } = UNPROCESSABLE_ENTITY_EXCEPTION.QUESTION_CATEGORY;

export class QuestionCategoryStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;
}

export class QuestionCategoryGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  excludeByExerciseId?: number;
}

export class QuestionCategoryUpdateDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  @IsOptional()
  name: string;
}
