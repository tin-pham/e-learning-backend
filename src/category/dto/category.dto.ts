import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { NAME, DESCRIPTION } = UNPROCESSABLE_ENTITY_EXCEPTION.CATEGORY;

export class CategoryStoreDTO {
  @ApiProperty()
  @IsString({
    message: NAME.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: DESCRIPTION.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  description?: string;
}

export class CategoryGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  withCourseCount?: boolean;
}

export class CategoryUpdateDTO {
  @ApiPropertyOptional()
  @IsString({
    message: NAME.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: DESCRIPTION.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  description: string;
}
