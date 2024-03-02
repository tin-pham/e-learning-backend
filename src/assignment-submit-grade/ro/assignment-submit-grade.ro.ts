import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AssignmentSubmitGradeStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  assignmentSubmitId: number;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  grade: number;

  constructor(data?: AssignmentSubmitGradeStoreRO) {
    Object.assign(this, data);
  }
}
