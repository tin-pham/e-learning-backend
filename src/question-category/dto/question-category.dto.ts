import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class QuestionCategoryStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;
}

export class QuestionCategoryGetListDTO extends PaginateDTO {}

export class QuestionCategoryUpdateDTO {
  @ApiProperty()
  @IsString()
  name: string;
}
