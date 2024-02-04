import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SignInUserRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  roles: string[];

  @ApiProperty()
  @Expose()
  displayName: string;
}

export class SignInRO {
  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;

  @ApiProperty({ type: SignInUserRO })
  @Type(() => SignInUserRO)
  @Expose()
  user: SignInUserRO;
}

export class RefreshTokenRO {
  @ApiProperty()
  accessToken: string;
}
