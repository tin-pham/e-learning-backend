import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class SectionStoreDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  courseId: number;
}

export class SectionGetListDTO extends PaginateDTO {
  @ApiProperty()
  @IsNumber()
  courseId: number;
}

export class SectionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
