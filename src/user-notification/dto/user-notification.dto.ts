import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class UserNotificationBulkUpdateDTO {
  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => Number)
  @IsNotEmpty()
  notificationIds: number[];

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;
}

export class UserNotificationBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  notificationIds: number[];
}
