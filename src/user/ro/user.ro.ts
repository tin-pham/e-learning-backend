import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class UserStoreRO {
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

export class UserGetDetailRO {
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

  @ApiProperty({ type: [UserGetDetailRoleRO] })
  @Type(() => UserGetDetailRoleRO)
  @Expose()
  roles: UserGetDetailRoleRO[];
}

export class UserGetListDataRO {
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
