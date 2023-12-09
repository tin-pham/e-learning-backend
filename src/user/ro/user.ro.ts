import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserStoreRO {
  @ApiProperty({ example: 'tinpham' })
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  displayName: string;
}

export class UserGetDetailRoleRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class UserGetDetailRO {
  @ApiProperty({ example: 'tinpham' })
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  displayName: string;

  @ApiProperty({ type: [UserGetDetailRoleRO] })
  @Type(() => UserGetDetailRoleRO)
  roles: UserGetDetailRoleRO[];
}
