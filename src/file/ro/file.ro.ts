import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}

export class FileDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
