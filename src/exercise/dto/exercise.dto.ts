import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';

export class ExerciseStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  difficultyId: number;

  @ApiProperty()
  @IsNumber()
  lessonId: number;
}

export class ExerciseGetListDTO extends PaginateDTO {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lessonId: number;
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
