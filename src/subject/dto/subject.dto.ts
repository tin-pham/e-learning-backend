import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class SubjectStoreDTO {
  @ApiProperty({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SubjectGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  groupId: string;
}

export class SubjectUpdateDTO {
  @ApiPropertyOptional({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  groupId: string;
}
