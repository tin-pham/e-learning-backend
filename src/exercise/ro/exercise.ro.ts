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

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  lessonId: number;

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
}

export class ExerciseGetListRO extends PaginateRO<ExerciseGetListDataRO> {
  @ApiProperty({ type: [ExerciseGetListDataRO] })
  @Type(() => ExerciseGetListDataRO)
  @Expose()
  data: ExerciseGetListDataRO[];
}

export class ExerciseGetDetailQuestionOptionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;
}

export class ExerciseGetDetailQuestionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty({ type: [ExerciseGetDetailQuestionOptionRO] })
  @Type(() => ExerciseGetDetailQuestionOptionRO)
  @Expose()
  options: ExerciseGetDetailQuestionOptionRO[];
}

export class ExerciseGetDetailDifficultyRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class ExerciseGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: ExerciseGetDetailDifficultyRO })
  @Type(() => ExerciseGetDetailDifficultyRO)
  @Expose()
  difficulty: ExerciseGetDetailDifficultyRO;

  @ApiProperty({ type: [ExerciseGetDetailQuestionRO] })
  @Type(() => ExerciseGetDetailQuestionRO)
  @Expose()
  questions: ExerciseGetDetailQuestionRO[];
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
