import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { USER_ROLE } from '../user-role.enum';

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

  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(USER_ROLE))
  role: string;
}
