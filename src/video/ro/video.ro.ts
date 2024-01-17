import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VideoStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  lessonId: number;

  constructor(data?: Partial<VideoStoreRO>) {
    Object.assign(this, data);
  }
}

export class VideoGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  lessonId: number;

  constructor(data?: Partial<VideoGetDetailRO>) {
    Object.assign(this, data);
  }
}

export class VideoDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: Partial<VideoDeleteRO>) {
    Object.assign(this, data);
  }
}
