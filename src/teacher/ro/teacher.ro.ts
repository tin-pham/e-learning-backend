import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class TeacherStoreUserRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class TeacherStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: TeacherStoreUserRO })
  @Type(() => TeacherStoreUserRO)
  @Expose()
  user: TeacherStoreUserRO;
}

export class TeacherGetListTeacherSubjectDataRO {
  @ApiProperty()
  @Expose()
  id: string;
}

export class TeacherGetListDataUserRO {
  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class TeacherGetListDataRO {
  @ApiProperty({ type: TeacherGetListDataUserRO })
  @Type(() => TeacherGetListDataUserRO)
  @Expose()
  user: TeacherGetListDataUserRO;

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

export class TeacherGetDetailUserRO {
  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class TeacherGetDetailRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: TeacherGetDetailUserRO })
  @Type(() => TeacherGetDetailUserRO)
  @Expose()
  user: TeacherGetDetailUserRO;
}

export class TeacherUpdateUserRO {
  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class TeacherUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: TeacherUpdateUserRO })
  @Type(() => TeacherUpdateUserRO)
  @Expose()
  user: TeacherUpdateUserRO;
}

export class TeacherDeleteUserRO {
  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class TeacherDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: TeacherDeleteUserRO })
  @Type(() => TeacherDeleteUserRO)
  @Expose()
  user: TeacherDeleteUserRO;
}
