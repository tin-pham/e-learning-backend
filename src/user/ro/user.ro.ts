import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class UserStoreRO {
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

export class UserGetDetailRoleRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class UserGetListDataRO {
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

export class UserGetListRO extends PaginateRO<UserGetListDataRO> {
  @ApiProperty({ type: [UserGetListDataRO] })
  @Type(() => UserGetListDataRO)
  @Expose()
  data: UserGetListDataRO[];
}

export class UserGetDetailRO {
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

export class UserUpdateRO {
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

export class UserDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;
}
