import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class GroupStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;
}

export class GroupGetListDataSubjectRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Math' })
  @Expose()
  name: string;
}

export class GroupGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ type: [GroupGetListDataSubjectRO] })
  @Type(() => GroupGetListDataSubjectRO)
  @Expose()
  subjects: GroupGetListDataSubjectRO[];
}

export class GroupGetListRO extends PaginateRO<GroupGetListDataRO> {
  @ApiProperty({ type: [GroupGetListDataRO] })
  @Type(() => GroupGetListDataRO)
  @Expose()
  data: GroupGetListDataRO[];
}

export class GroupUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;
}

export class GroupDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;
}
