import { ApiProperty } from '@nestjs/swagger';
import { IsString, ArrayMinSize, IsArray } from 'class-validator';

export class TeacherSubjectBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  teacherIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: string[];
}
