import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';
import { IsNotBlank } from 'src/common/decorator/validator/is-not-blank.validator';

const { PHONE, EMAIL, USERNAME, PASSWORD, DISPLAY_NAME } = UNPROCESSABLE_ENTITY_EXCEPTION.USER;

export class UserStoreDTO {
  @ApiProperty({ example: 'tinpham' })
  @IsString()
  @IsNotBlank({}, { message: USERNAME.IS_NOT_EMPTY })
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotBlank({}, { message: PASSWORD.IS_NOT_EMPTY })
  password: string;

  @ApiPropertyOptional({ example: 'tinpham@example.com' })
  @IsEmail({}, { message: EMAIL.FORMAT_IS_NOT_VALID })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsPhoneNumber('VN', { message: PHONE.FORMAT_IS_NOT_VALID })
  @IsNotEmpty()
  @IsNumberString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @IsString()
  @IsNotBlank({}, { message: DISPLAY_NAME.IS_NOT_EMPTY })
  @IsNotEmpty()
  displayName: string;
}

export class UserGetListDTO extends PaginateDTO {}
export class UserUpdateDTO {
  @ApiPropertyOptional({ example: '123456' })
  @IsString()
  @IsNotBlank({}, { message: PASSWORD.IS_NOT_EMPTY })
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
  @IsNotBlank({}, { message: DISPLAY_NAME.IS_NOT_EMPTY })
  @IsOptional()
  displayName?: string;
}
