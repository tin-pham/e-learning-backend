import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';

export class ExerciseStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  difficultyId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  sectionId?: number;
}

export class ExerciseGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sectionId?: number;
}

export class ExerciseUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}

export class ExerciseDeleteDTO {
  @ApiProperty()
  @IsString()
  id: string;
}
