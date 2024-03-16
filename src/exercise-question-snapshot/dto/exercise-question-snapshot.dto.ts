import { IsNumber, IsOptional } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ExerciseQuestionSnapshotGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  exerciseId?: number;
}
