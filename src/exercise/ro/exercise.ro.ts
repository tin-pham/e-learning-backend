import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ExerciseStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ExerciseGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ExerciseGetListRO extends PaginateRO<ExerciseGetListDataRO> {
  @ApiProperty({ type: [ExerciseGetListDataRO] })
  @Type(() => ExerciseGetListDataRO)
  @Expose()
  data: ExerciseGetListDataRO[];
}

export class ExerciseGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ExerciseUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ExerciseDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
