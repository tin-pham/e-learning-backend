import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';

export class QuestionStoreOptionDTO {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  isCorrect: boolean = false;
}

export class QuestionStoreDTO {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  difficultyId: number;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  isMultipleChoice: boolean = false;

  @ApiProperty({ type: [QuestionStoreOptionDTO] })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => QuestionStoreOptionDTO)
  @IsOptional()
  options?: QuestionStoreOptionDTO[];
}

export class QuestionGetListDTO extends PaginateDTO {}

export class QuestionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  difficultyId?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isMultipleChoice?: boolean;
}
