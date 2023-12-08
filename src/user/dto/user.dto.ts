import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

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
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  @IsNumberString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: 1, isArray: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  roleIds: string[];
}
