import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class ClassroomStoreDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  gradeId: number;
}

export class ClassroomGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  yearId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  gradeId: number;
}
