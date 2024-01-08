import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class SubjectGroupBulkStoreDTO {
  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: number[];

  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  groupIds: number[];
}

export class SubjectGroupBulkDeleteDTO {
  @ApiProperty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  subjectIds: number[];

  @ApiProperty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  groupIds: number[];
}
