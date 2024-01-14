import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class ExerciseStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;
}

export class ExerciseGetListDTO extends PaginateDTO {}

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
