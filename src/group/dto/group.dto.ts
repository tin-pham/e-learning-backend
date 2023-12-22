import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class GroupGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subjectId: string;
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
