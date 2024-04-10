import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';

const { NAME } = UNPROCESSABLE_ENTITY_EXCEPTION.CATEGORY;

export class CategoryStoreDTO {
  @ApiProperty()
  @IsString({ message: NAME.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  description?: object;
}

export class CategoryGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  withCourseCount?: boolean;
}

export class CategoryUpdateDTO {
  @ApiPropertyOptional()
  @IsString({ message: NAME.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  description: object;
}
