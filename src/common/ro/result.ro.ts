import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResultRO {
  @ApiProperty()
  @Expose()
  result: boolean;
}
