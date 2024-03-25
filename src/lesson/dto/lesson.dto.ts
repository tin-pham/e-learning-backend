import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';

const { BODY, TITLE, VIDEO_URL, SECTION_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.LESSON;

export class LessonStoreDTO {
  @ApiProperty()
  @IsString({ message: TITLE.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: TITLE.IS_NOT_EMPTY })
  title: string;

  @ApiPropertyOptional()
  @IsObject({ message: BODY.FORMAT_IS_NOT_VALID })
  @IsNotEmpty({ message: BODY.IS_NOT_EMPTY })
  @IsOptional()
  body?: object;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: SECTION_ID.FORMAT_IS_NOT_VALID })
  @IsNotEmpty({ message: SECTION_ID.IS_NOT_EMPTY })
  @Type(() => Number)
  sectionId: number;

  @ApiPropertyOptional()
  @IsUrl({}, { message: VIDEO_URL.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: VIDEO_URL.IS_NOT_BLANK })
  @IsOptional()
  videoUrl?: string;
}

export class LessonGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: SECTION_ID.FORMAT_IS_NOT_VALID })
  @Type(() => Number)
  sectionId?: number;
}

export class LessonUpdateDTO {
  @ApiPropertyOptional()
  @IsString({ message: TITLE.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: TITLE.IS_NOT_EMPTY })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsObject({ message: BODY.FORMAT_IS_NOT_VALID })
  @IsOptional()
  body?: object;

  @ApiProperty()
  @IsUrl({}, { message: VIDEO_URL.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: VIDEO_URL.IS_NOT_BLANK })
  @IsOptional()
  videoUrl: string;
}
