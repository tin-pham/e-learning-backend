import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AnswerStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  questionOptionId: number;

  @ApiProperty()
  @Expose()
  questionId: number;
}

export class AnswerGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  questionOptionId: number;

  @ApiProperty()
  @Expose()
  questionId: number;
}

export class AnswerUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  questionOptionId: number;

  @ApiProperty()
  @Expose()
  questionId: number;
}

export class AnswerDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
