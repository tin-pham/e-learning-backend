import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class SubjectStoreDTO {
  @ApiProperty({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SubjectGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  groupId: number;
}

export class SubjectUpdateDTO {
  @ApiPropertyOptional({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  groupId: number;
}
