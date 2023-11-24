import { ApiProperty } from '@nestjs/swagger';

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
