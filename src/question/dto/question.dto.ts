import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class QuestionStoreDTO {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  difficultyId: number;

  @ApiProperty()
  @IsBoolean()
  isMultipleChoice: boolean = false;
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
