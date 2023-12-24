import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from 'src/common/dto/paginate.dto';

export class ClassroomStoreDTO {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gradeId: string;
}

export class ClassroomGetListDTO extends PaginateDTO {}

export class ClassroomUpdateDTO {
  @ApiPropertyOptional({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  gradeId?: string;
}
