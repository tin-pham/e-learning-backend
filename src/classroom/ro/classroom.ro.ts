import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ClassroomStoreRO {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ example: 'A' })
  name: string;

  @Expose()
  @ApiProperty()
  gradeId: string;
}

export class ClassroomGetListDataRO {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Grade 6' })
  @Expose()
  name: string;
}

export class ClassroomGetListRO extends PaginateRO<ClassroomGetListDataRO> {
  @ApiProperty({ type: [ClassroomGetListDataRO] })
  @Type(() => ClassroomGetListDataRO)
  @Expose()
  data: ClassroomGetListDataRO[];
}

export class ClassroomUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  gradeId: string;
}

export class ClassroomDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;
}
