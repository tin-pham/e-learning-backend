import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class QuestionOptionStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;

  @ApiProperty()
  @Expose()
  questionId: number;
}

export class QuestionOptionGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  questionId: number;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;
}

export class QuestionOptionGetListRO extends PaginateRO<QuestionOptionGetListDataRO> {
  @ApiProperty({ type: [QuestionOptionGetListDataRO] })
  @Type(() => QuestionOptionGetListDataRO)
  @Expose()
  data: QuestionOptionGetListDataRO[];
}

export class QuestionOptionGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;

  @ApiProperty()
  @Expose()
  questionId: number;
}

export class QuestionOptionDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
