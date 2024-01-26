import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsUrl } from 'class-validator';

export class AssignmentAttachmentBulkStoreDTO {
  @ApiProperty({ example: ['https://example.com/1', 'https://example.com/2'] })
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  urls: string[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  assignmentId: number;
}
