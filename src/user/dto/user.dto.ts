import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class UserStoreDTO {
  @ApiProperty({ example: 'tinpham' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: 'tinpham@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  @IsNumberString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class UserGetListDTO extends PaginateDTO {}
export class UserUpdateDTO {
  @ApiPropertyOptional({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'tinpham@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  @IsNumberString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Tin Pham' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  displayName?: string;
}
