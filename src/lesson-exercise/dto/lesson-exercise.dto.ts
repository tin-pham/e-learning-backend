import { ApiProperty } from '@nestjs/swagger';

export class LessonExerciseStoreDTO {
  @ApiProperty()
  lessonId: string;

  @ApiProperty()
  exerciseId: string;
}
