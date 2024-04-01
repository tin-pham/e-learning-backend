import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';
import { PaginateDTO } from 'src/common/dto/paginate.dto';

const { CONTENT } = UNPROCESSABLE_ENTITY_EXCEPTION.POST;

export class PostStoreDTO {
  @ApiProperty({ example: 'test' })
  @IsNotEmptyObject(
    {},
    {
      message: CONTENT.IS_NOT_EMPTY,
    },
  )
  content: object;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}

export class PostUpdateDTO {
  @ApiProperty()
  @IsNotEmptyObject()
  content: object;
}

export class PostGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  courseId: number;
}
