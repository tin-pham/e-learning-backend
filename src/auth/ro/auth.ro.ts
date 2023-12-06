import { ApiProperty } from '@nestjs/swagger';

export class SignInRO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
