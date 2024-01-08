import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class S3UploadRO {
  @ApiProperty()
  @Expose()
  urls: string[];
}
