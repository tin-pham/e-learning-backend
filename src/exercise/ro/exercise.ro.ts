import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
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

  @ApiPropertyOptional()
  @Expose()
  instantMark: boolean;

  @ApiPropertyOptional()
  @Expose()
  allowRedo: boolean;

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
  isSubmitted: boolean;

  @ApiProperty()
  @Expose()
  submissionDate: Date;

  @ApiProperty()
  @Expose()
  isSubmissionLate: boolean;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  studentExerciseId: number;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value === null) {
      return false;
    } else {
      return true;
    }
  })
  @Expose()
  isStartDoing: boolean;

  @ApiProperty()
  @Expose()
  startDoingAt: Date;

  @ApiProperty()
  @Expose()
  activatedAt: Date;

  @ApiProperty()
  @Expose()
  time: number;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  @ApiProperty()
  @Expose()
  studentExerciseGradeId: number;

  @ApiProperty()
  @Expose()
  point?: number;

  @ApiProperty()
  @Expose()
  totalCount?: number;

  @ApiProperty()
  @Expose()
  correctCount?: number;
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

  @ApiProperty()
  @Expose()
  studentId: string;

  @ApiProperty()
  @Expose()
  studentExerciseId: number;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value === null) {
      return false;
    } else {
      return true;
    }
  })
  @Expose()
  isStartDoing: boolean;

  @ApiProperty()
  @Expose()
  startDoingAt: Date;

  @ApiProperty()
  @Expose()
  isSubmitted: boolean;

  @ApiProperty()
  @Expose()
  studentExerciseGradeId: number;

  @ApiProperty()
  @Expose()
  point?: number;

  @ApiProperty()
  @Expose()
  totalCount?: number;

  @ApiProperty()
  @Expose()
  correctCount?: number;

  @ApiProperty()
  @Expose()
  instantMark?: boolean;

  @ApiProperty()
  @Expose()
  allowRedo?: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    if (value === null) {
      return false;
    } else {
      return true;
    }
  })
  isGraded: boolean;
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
