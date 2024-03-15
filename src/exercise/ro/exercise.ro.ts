import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ExerciseStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  lessonId: number;

  @ApiProperty()
  @Expose()
  time: number;

  @ApiPropertyOptional()
  @Expose()
  dueDate: Date;

  constructor(data?: ExerciseStoreRO) {
    Object.assign(this, data);
  }
}

export class ExerciseGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  difficultyName: string;

  @ApiProperty()
  @Expose()
  submissionId: number;

  @ApiProperty()
  @Expose()
  isActive: number;

  @ApiProperty()
  @Expose()
  activatedAt: Date;

  @ApiProperty()
  @Expose()
  time: number;

  @ApiProperty()
  @Expose()
  dueDate: Date;
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

  @ApiProperty()
  @Expose()
  difficultyName: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isActive: number;

  @ApiProperty()
  @Expose()
  activatedAt: Date;

  @ApiProperty()
  @Expose()
  time: number;

  @ApiProperty()
  @Expose()
  dueDate: Date;
}

export class ExerciseUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  activatedAt: Date;

  @ApiPropertyOptional()
  @Expose()
  time?: number;

  @ApiPropertyOptional()
  @Expose()
  dueDate?: Date;
}
