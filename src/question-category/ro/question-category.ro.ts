import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class QuestionCategoryStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(data?: QuestionCategoryStoreRO) {
    Object.assign(this, data);
  }
}

export class QuestionCategoryGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  questionCount: number;
}

export class QuestionCategoryGetListRO extends PaginateRO<QuestionCategoryGetListDataRO> {
  @ApiProperty({ type: [QuestionCategoryGetListDataRO] })
  @Type(() => QuestionCategoryGetListDataRO)
  @Expose()
  data: QuestionCategoryGetListDataRO[];
}

export class QuestionCategoryGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(data?: QuestionCategoryGetDetailRO) {
    Object.assign(this, data);
  }
}

export class QuestionCategoryUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(data?: QuestionCategoryGetDetailRO) {
    Object.assign(this, data);
  }
}

export class QuestionCategoryDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: QuestionCategoryDeleteRO) {
    Object.assign(this, data);
  }
}
