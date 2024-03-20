import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class StudentStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;
}

export class StudentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty()
  @Expose()
  userImageUrl: string;
}

export class StudentGetListRO extends PaginateRO<StudentGetListDataRO> {
  @ApiProperty({ type: [StudentGetListDataRO] })
  @Type(() => StudentGetListDataRO)
  @Expose()
  data: StudentGetListDataRO[];
}

export class StudentGetDetailRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;
}

export class StudentUpdateUserRO {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;
}

export class StudentUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;
}

export class StudentDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;
}
