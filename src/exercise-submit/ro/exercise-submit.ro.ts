import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ExerciseSubmitStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  exerciseId: number;

  @ApiProperty()
  @Expose()
  isSubmit: boolean;

  @ApiProperty()
  @Expose()
  studentId: string;

  constructor(data?: ExerciseSubmitStoreRO) {
    Object.assign(this, data);
  }
}

export class ExerciseSubmitGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  exerciseId: number;

  @ApiProperty()
  @Expose()
  isSubmit: boolean;

  @ApiProperty()
  @Expose()
  studentId: string;
}

export class ExerciseSubmitGetListRO extends PaginateRO<ExerciseSubmitGetListDataRO> {
  @ApiProperty({ type: [ExerciseSubmitGetListDataRO] })
  @Type(() => ExerciseSubmitGetListDataRO)
  @Expose()
  override data: ExerciseSubmitGetListDataRO[];
}
