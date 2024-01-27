import { Module } from '@nestjs/common';
import { ExerciseSubmitOptionController } from './exercise-submit-option.controller';
import { ExerciseSubmitOptionService } from './exercise-submit-option.service';
import { ExerciseSubmitOptionRepository } from './exercise-submit-option.repository';
import { ExerciseSubmitRepository } from '../exercise-submit/exercise-submit.repository';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';

@Module({
  controllers: [ExerciseSubmitOptionController],
  providers: [
    ExerciseSubmitOptionService,
    ExerciseSubmitOptionRepository,
    ExerciseSubmitRepository,
    QuestionRepository,
    QuestionOptionRepository,
  ],
})
export class ExerciseSubmitOptionModule {}
