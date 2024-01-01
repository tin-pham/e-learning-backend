import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClassroomYearAssignmentBulkStoreDTO {
  @ApiProperty()
  @Expose()
  classroomYearIds: string[];

  @ApiProperty()
  @Expose()
  teacherSubjectIds: string[];
}
