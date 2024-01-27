import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class ExerciseSubmitStoreDTO {
  @ApiProperty()
  @IsNumber()
  exerciseId: number;
}

export class ExerciseSubmitGetListDTO extends PaginateDTO {}

export class ExerciseSubmitUpdateDTO {
  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  isSubmit: boolean;
}
