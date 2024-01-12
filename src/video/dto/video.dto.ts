import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class VideoStoreDTO {
  @ApiProperty()
  @IsUrl()
  url: string;
}
