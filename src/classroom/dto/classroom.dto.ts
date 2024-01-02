import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class ClassroomStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gradeId: string;
}

export class ClassroomGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  yearId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gradeId: string;
}
