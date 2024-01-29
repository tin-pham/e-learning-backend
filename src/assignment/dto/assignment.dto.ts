import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsString, IsUrl, MaxDate, MinDate } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class AssignmentStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @MinDate(new Date('2010-01-01'))
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date;

  @ApiProperty()
  @IsNumber()
  courseId: number;

  @ApiPropertyOptional({ example: ['https://example.com/1', 'https://example.com/2'] })
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  urls?: string[];

  @ApiProperty({ example: [1] })
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  exerciseIds?: number[];
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
  @MinDate(new Date('2010-01-01'))
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dueDate: Date;

  @ApiProperty()
  @IsNumber()
  courseId: number;
}
