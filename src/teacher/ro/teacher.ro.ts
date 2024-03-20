import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class TeacherStoreRO {
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

export class TeacherGetListDataRO {
  @ApiProperty({ example: 'tinpham' })
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

  @ApiProperty()
  @Expose()
  userImageUrl: string;
}

export class TeacherGetListRO extends PaginateRO<TeacherGetListDataRO> {
  @ApiProperty({ type: [TeacherGetListDataRO] })
  @Type(() => TeacherGetListDataRO)
  @Expose()
  data: TeacherGetListDataRO[];
}

export class TeacherGetDetailRO {
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

export class TeacherUpdateRO {
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

export class TeacherDeleteRO {
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
