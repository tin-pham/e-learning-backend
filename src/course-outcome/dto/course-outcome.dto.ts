import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CourseOutcomeStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}

export class CourseOutcomeUpdateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
