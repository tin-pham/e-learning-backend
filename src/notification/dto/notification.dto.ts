import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class NotificationStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1})
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

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

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;
}
