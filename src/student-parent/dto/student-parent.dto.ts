import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import {
  ApiArrayProperty,
  SwaggerQueryParamStyle,
} from '../../common/decorator';

export class StudentParentBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  parentIds: string[];
}

export class StudentParentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  parentIds: string[];
}
