import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DirectoryStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  parentId: number;
}

export class DirectoryGetListDTO {
  @ApiProperty()
  @IsNumber()
  directoryId: number;
}

export class DirectoryGetDetailDTO {}

export class DirectoryUpdateDTO {
  @ApiProperty()
  @IsString()
  name: string;
}
