import { Module } from '@nestjs/common';
import { ExerciseSubmitMarkController } from './exercise-submit-mark.controller';
import { ExerciseSubmitMarkService } from './exercise-submit-mark.service';
import { ExerciseSubmitMarkRepository } from './exercise-submit-mark.repository';
import { ExerciseSubmitRepository } from '../exercise-submit/exercise-submit.repository';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ExerciseSubmitOptionRepository } from '../exercise-submit-option/exercise-submit-option.repository';

@Module({
  controllers: [ExerciseSubmitMarkController],
  providers: [
    ExerciseSubmitMarkService,
    ExerciseSubmitMarkRepository,
    ExerciseSubmitRepository,
    ExerciseSubmitOptionRepository,
    QuestionRepository,
    QuestionOptionRepository,
  ],
})
export class ExerciseSubmitMarkModule {}
