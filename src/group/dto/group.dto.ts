import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class GroupGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  subjectId: number;
}

export class GroupStoreDTO {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GroupUpdateDTO {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
