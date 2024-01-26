import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class SubmitStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  exerciseId: number;

  constructor(data?: SubmitStoreRO) {
    Object.assign(this, data);
  }
}

export class SubmitGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  exerciseId: number;
}

export class SubmitGetListRO extends PaginateRO<SubmitGetListDataRO> {
  @ApiProperty({ type: [SubmitGetListDataRO] })
  @Type(() => SubmitGetListDataRO)
  @Expose()
  override data: SubmitGetListDataRO[];
}
