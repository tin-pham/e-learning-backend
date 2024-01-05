import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class StudentStoreUserRO {
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

export class StudentStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: StudentStoreUserRO })
  @Type(() => StudentStoreUserRO)
  @Expose()
  user: StudentStoreUserRO;
}

export class StudentGetListDataUserRO {
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

  @ApiProperty({ type: StudentGetListDataUserRO })
  @Type(() => StudentGetListDataUserRO)
  @Expose()
  user: StudentGetListDataUserRO;
}

export class StudentGetListRO extends PaginateRO<StudentGetListDataRO> {
  @ApiProperty({ type: [StudentGetListDataRO] })
  @Type(() => StudentGetListDataRO)
  @Expose()
  data: StudentGetListDataRO[];
}

export class StudentGetDetailUserRO {
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

export class StudentGetDetailRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: StudentGetDetailUserRO })
  @Type(() => StudentGetDetailUserRO)
  @Expose()
  user: StudentGetDetailUserRO;
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

  @ApiProperty({ type: StudentUpdateUserRO })
  @Type(() => StudentUpdateUserRO)
  @Expose()
  user: StudentUpdateUserRO;
}

export class StudentDeleteUserRO {
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

  @ApiProperty({ type: StudentDeleteUserRO })
  @Type(() => StudentDeleteUserRO)
  @Expose()
  user: StudentDeleteUserRO;
}
