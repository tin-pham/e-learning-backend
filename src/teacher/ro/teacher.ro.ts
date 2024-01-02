import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  UserStoreRO,
  UserGetDetailRO,
  UserUpdateRO,
  UserDeleteRO,
  UserGetListDataRO,
} from '../../user/ro/user.ro';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class TeacherStoreRO extends UserStoreRO {}

export class TeacherGetListTeacherSubjectDataRO {
  @ApiProperty()
  @Expose()
  id: string;
}

export class TeacherGetListDataRO extends UserGetListDataRO {
  @ApiPropertyOptional({ type: [TeacherGetListTeacherSubjectDataRO] })
  @Type(() => TeacherGetListTeacherSubjectDataRO)
  @Expose()
  teacherSubjects: TeacherGetListTeacherSubjectDataRO[];
}

export class TeacherGetListRO extends PaginateRO<TeacherGetListDataRO> {
  @ApiProperty({ type: [TeacherGetListDataRO] })
  @Type(() => TeacherGetListDataRO)
  @Expose()
  data: TeacherGetListDataRO[];
}

export class TeacherGetDetailRO extends UserGetDetailRO {}
export class TeacherUpdateRO extends UserUpdateRO {}
export class TeacherDeleteRO extends UserDeleteRO {}
