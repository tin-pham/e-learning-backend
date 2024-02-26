import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserImageUpsertRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  size: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  createdBy: number;
}

export class UserImageDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
