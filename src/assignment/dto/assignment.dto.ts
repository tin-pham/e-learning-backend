import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxDate, MinDate } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class AssignmentStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @MinDate(new Date())
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date;
}

export class AssignmentGetListDTO extends PaginateDTO {}

export class AssignmentUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @MinDate(new Date())
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dueDate: Date;
}
