import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class LessonCommentStoreDTO {
  @ApiProperty()
  @IsNumber()
  lessonId: number;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsNumber()
  parentId?: number;
}

export class LessonCommentGetListDTO extends PaginateDTO {}
