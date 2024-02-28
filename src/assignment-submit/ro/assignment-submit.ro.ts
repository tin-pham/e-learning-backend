import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class AssignmentSubmitGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  attachmentUrl: string;

  @ApiProperty()
  @Expose()
  attachmentName: string;

  @ApiProperty()
  @Expose()
  attachmentCreatedAt: Date;

  @ApiProperty()
  @Expose()
  attachmentCreatedBy: number;
}

export class AssignmentSubmitGetListRO extends PaginateRO<AssignmentSubmitGetListDataRO> {
  @ApiProperty({ type: [AssignmentSubmitGetListDataRO] })
  @Type(() => AssignmentSubmitGetListDataRO)
  @Expose()
  data: AssignmentSubmitGetListDataRO[];
}
