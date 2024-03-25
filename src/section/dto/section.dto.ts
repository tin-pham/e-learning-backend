import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsNotBlank } from 'src/common/decorator/validator/is-not-blank.validator';

const { NAME, COURSE_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.SECTION;

export class SectionStoreDTO {
  @ApiProperty()
  @IsString({ message: NAME.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: COURSE_ID.FORMAT_IS_NOT_VALID })
  @IsNotEmpty({ message: COURSE_ID.IS_NOT_EMPTY })
  @Type(() => Number)
  courseId: number;
}

export class SectionGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: COURSE_ID.FORMAT_IS_NOT_VALID })
  @Type(() => Number)
  @IsNotEmpty({ message: COURSE_ID.IS_NOT_EMPTY })
  courseId: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  withLesson?: boolean;
}

export class SectionGetDetailDTO {
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  withLesson?: boolean;
}

export class SectionUpdateDTO {
  @ApiPropertyOptional()
  @IsString({ message: NAME.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  @IsOptional()
  name?: string;
}
