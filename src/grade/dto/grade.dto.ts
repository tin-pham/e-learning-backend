import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class GradeStoreDTO {
  @ApiProperty({ example: '6' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GradeGetListDTO extends PaginateDTO {}
export class GradeUpdateDTO {
  @ApiPropertyOptional({ example: '6' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
