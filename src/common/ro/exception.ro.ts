import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionRO {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: string;
}
