import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class VideoStoreDTO {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  lessonId: number;
}
