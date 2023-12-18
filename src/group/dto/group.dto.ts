import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GroupStoreDTO {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GroupUpdateDTO {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
