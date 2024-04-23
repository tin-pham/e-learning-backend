import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class StudentExerciseStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  startDoingAt: Date;
}

export class StudentExerciseGetListSubmittedDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  studentId: string;

  @ApiProperty()
  @Expose()
  exerciseId: number;

  @ApiProperty()
  @Expose()
  isSubmitted: boolean;

  @ApiProperty()
  @Expose()
  submittedAt: Date;

  @ApiProperty()
  @Expose()
  isLate: boolean;

  @ApiProperty()
  @Expose()
  userDisplayName: string;

  @ApiProperty()
  @Expose()
  userImageUrl: string;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  point: number;

  @ApiProperty()
  @Expose()
  totalCount: number;

  @ApiProperty()
  @Expose()
  correctCount: number;
}

export class StudentExerciseGetListSubmittedRO extends PaginateRO<StudentExerciseGetListSubmittedDataRO> {
  @ApiProperty({ type: [StudentExerciseGetListSubmittedDataRO] })
  @Type(() => StudentExerciseGetListSubmittedDataRO)
  @Expose()
  data: StudentExerciseGetListSubmittedDataRO[];
}
