import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { NAME } = UNPROCESSABLE_ENTITY_EXCEPTION.COURSE_OUTCOME;

export class CourseOutcomeGetListDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId: number;
}

export class CourseOutcomeStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}

export class CourseOutcomeUpdateDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;
}
