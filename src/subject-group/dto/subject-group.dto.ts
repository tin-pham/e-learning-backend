import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import {
  ApiArrayProperty,
  SwaggerQueryParamStyle,
} from '../../common/decorator';

export class SubjectGroupBulkStoreDTO {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  subjectIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  groupIds: string[];
}

export class SubjectGroupBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  subjectIds: string[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  groupIds: string[];
}
