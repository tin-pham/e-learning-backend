import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from 'src/common/dto/paginate.dto';

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
  gradeId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  yearId: string;
}
