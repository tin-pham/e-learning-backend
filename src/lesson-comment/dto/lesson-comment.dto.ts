import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { BODY } = UNPROCESSABLE_ENTITY_EXCEPTION.LESSON_COMMENT;

export class LessonCommentStoreDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  lessonId: number;

  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: BODY.IS_NOT_EMPTY })
  body: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class LessonCommentGetListDTO extends PaginateDTO {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  commentId?: number;
}

export class LessonCommentUpdateDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: BODY.IS_NOT_EMPTY })
  body: string;
}
