import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class QuestionStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;
}

export class QuestionGetListOptionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;
}

export class QuestionGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  difficultyName: string;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;

  @ApiProperty({ type: [QuestionGetListOptionRO] })
  @Type(() => QuestionGetListOptionRO)
  @Expose()
  options: QuestionGetListOptionRO[];
}

export class QuestionGetListRO extends PaginateRO<QuestionGetListDataRO> {
  @ApiProperty({ type: [QuestionGetListDataRO] })
  @Type(() => QuestionGetListDataRO)
  @Expose()
  data: QuestionGetListDataRO[];
}

export class QuestionStudentGetListDataOptionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;
}

export class QuestionStudentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  difficultyName: string;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;

  @ApiProperty({ type: [QuestionStudentGetListDataOptionRO] })
  @Type(() => QuestionStudentGetListDataOptionRO)
  @Expose()
  options: QuestionStudentGetListDataOptionRO[];
}

export class QuestionStudentGetListRO extends PaginateRO<QuestionStudentGetListDataRO> {
  @ApiProperty({ type: [QuestionStudentGetListDataRO] })
  @Type(() => QuestionStudentGetListDataRO)
  @Expose()
  data: QuestionStudentGetListDataRO[];
}

export class QuestionGetDetailOptionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;
}

export class QuestionGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;

  @ApiProperty({ type: [QuestionGetDetailOptionRO] })
  @Type(() => QuestionGetDetailOptionRO)
  @Expose()
  options: QuestionGetDetailOptionRO[];
}

export class QuestionUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;
}

export class QuestionDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
