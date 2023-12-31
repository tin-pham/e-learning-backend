import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ClassroomYearStudentBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  classroomYearIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];
}
