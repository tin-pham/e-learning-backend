import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class TeacherSubjectGetListDataTeacherUserRO {
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

export class TeacherSubjectGetListDataTeacherRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: TeacherSubjectGetListDataTeacherUserRO })
  @Type(() => TeacherSubjectGetListDataTeacherUserRO)
  @Expose()
  user: TeacherSubjectGetListDataTeacherUserRO;
}

export class TeacherSubjectGetListDataSubjectRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class TeacherSubjectGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Type(() => TeacherSubjectGetListDataTeacherRO)
  @Expose()
  teacher: TeacherSubjectGetListDataTeacherRO;

  @ApiProperty()
  @Type(() => TeacherSubjectGetListDataSubjectRO)
  @Expose()
  subject: TeacherSubjectGetListDataSubjectRO;
}

export class TeacherSubjectGetListRO extends PaginateRO<TeacherSubjectGetListDataRO> {
  @ApiProperty({ type: [TeacherSubjectGetListDataRO] })
  @Type(() => TeacherSubjectGetListDataRO)
  @Expose()
  override data: TeacherSubjectGetListDataRO[];
}
