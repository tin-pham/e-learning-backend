import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class SubjectGroupBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  groupIds: string[];
}
