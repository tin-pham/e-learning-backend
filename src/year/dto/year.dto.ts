import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, MaxDate, MinDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class YearGetListDTO extends PaginateDTO {}

export class YearUpdateDTO {
  @ApiProperty()
  @MinDate(new Date('1970-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  startDate: Date;

  @ApiProperty()
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  endDate: Date;
}
