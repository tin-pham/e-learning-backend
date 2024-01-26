import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubmitOptionStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  questionId: number;

  @ApiProperty()
  @Expose()
  questionOptionId: number;

  constructor(data?: SubmitOptionStoreRO) {
    Object.assign(this, data);
  }
}

export class SubmitOptionUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  questionOptionId: number;

  constructor(data?: SubmitOptionUpdateRO) {
    Object.assign(this, data);
  }
}
