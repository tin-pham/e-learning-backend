import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class FileStoreDTO {
  @ApiProperty()
  @IsUrl()
  url: string;
}
