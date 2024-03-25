import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { TITLE, CONTENT } = UNPROCESSABLE_ENTITY_EXCEPTION.NOTIFICATION;

export class NotificationStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: TITLE.IS_NOT_EMPTY })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: CONTENT.IS_NOT_EMPTY })
  content: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  commentId: number;

  constructor(data?: NotificationStoreDTO) {
    Object.assign(this, data);
  }
}

export class NotificationGetListDTO extends PaginateDTO {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  courseId?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  byUser?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  withRead?: boolean;
}
