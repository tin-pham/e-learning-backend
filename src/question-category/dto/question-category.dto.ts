import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { NAME } = UNPROCESSABLE_ENTITY_EXCEPTION.QUESTION_CATEGORY;

export class QuestionCategoryStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  name: string;
}

export class QuestionCategoryGetListDTO extends PaginateDTO {}

export class QuestionCategoryUpdateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  @IsOptional()
  name: string;
}
