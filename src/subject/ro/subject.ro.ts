import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class SubjectStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Math' })
  @Expose()
  name: string;
}

export class SubjectGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Math' })
  @Expose()
  name: string;
}

export class SubjectGetListRO extends PaginateRO<SubjectGetListDataRO> {
  @ApiProperty({ type: [SubjectGetListDataRO] })
  @Type(() => SubjectGetListDataRO)
  @Expose()
  data: SubjectGetListDataRO[];
}
