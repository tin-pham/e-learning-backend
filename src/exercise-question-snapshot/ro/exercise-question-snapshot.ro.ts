import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class ExerciseQuestionSnapshotGetListOptionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value === undefined) {
      return false;
    }
    console.log(value);

    if (value === null) {
      return false;
    }
    return true;
  })
  @Expose()
  isChosen: boolean;
}

export class ExerciseQuestionSnapshotGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  difficultyName: string;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;

  @ApiProperty({ type: [ExerciseQuestionSnapshotGetListOptionRO] })
  @Type(() => ExerciseQuestionSnapshotGetListOptionRO)
  @Expose()
  options: ExerciseQuestionSnapshotGetListOptionRO[];
}

export class ExerciseQuestionSnapshotGetListRO extends PaginateRO<ExerciseQuestionSnapshotGetListDataRO> {
  @ApiProperty({ type: [ExerciseQuestionSnapshotGetListDataRO] })
  @Type(() => ExerciseQuestionSnapshotGetListDataRO)
  @Expose()
  data: ExerciseQuestionSnapshotGetListDataRO[];
}
