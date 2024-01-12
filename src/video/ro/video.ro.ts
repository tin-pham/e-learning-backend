import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VideoStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}

export class VideoDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}
