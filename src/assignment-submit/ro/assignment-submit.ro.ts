import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class AssignmentSubmitGetListDataRO {
  @ApiProperty()
  @Expose()
  url: string;
}

export class AssignmentSubmitGetListRO extends PaginateRO<AssignmentSubmitGetListDataRO> {
  @ApiProperty({ type: [AssignmentSubmitGetListDataRO] })
  @Type(() => AssignmentSubmitGetListDataRO)
  @Expose()
  data: AssignmentSubmitGetListDataRO[];
}
