import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClassroomYearStudentBulkStoreDTO {
  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  classroomYearIds: number[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];
}
