import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ROOT_DIRECTORY_ID } from '../enum/directory.enum';

export class DirectoryStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parentId?: number = ROOT_DIRECTORY_ID;
}

export class DirectoryGetListDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  directoryId?: number = ROOT_DIRECTORY_ID;
}

export class DirectoryGetDetailDTO {}

export class DirectoryUpdateDTO {
  @ApiProperty()
  @IsString()
  name: string;
}
