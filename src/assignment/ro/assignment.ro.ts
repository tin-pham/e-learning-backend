import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class AssignmentStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  constructor(data?: AssignmentStoreRO) {
    Object.assign(this, data);
  }
}

export class AssignmentUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  constructor(data?: AssignmentStoreRO) {
    Object.assign(this, data);
  }
}

export class AssignmentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;
}

export class AssignmentGetListRO extends PaginateRO<AssignmentGetListDataRO> {
  @ApiProperty({ type: [AssignmentGetListDataRO] })
  @Type(() => AssignmentGetListDataRO)
  @Expose()
  override data: AssignmentGetListDataRO[];
}

export class AssignmentGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  @ApiProperty()
  @Expose()
  createdByDisplayName: string;

  constructor(data?: AssignmentGetDetailRO) {
    Object.assign(this, data);
  }
}

export class AssignmentDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: AssignmentDeleteRO) {
    Object.assign(this, data);
  }
}

export class AssignmentGetSubmissionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}
