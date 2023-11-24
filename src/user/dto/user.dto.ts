import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserStoreDTO {
  @ApiProperty({ example: 'tinpham' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}
