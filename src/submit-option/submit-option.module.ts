import { Module } from '@nestjs/common';
import { SubmitOptionController } from './submit-option.controller';
import { SubmitOptionRepository } from './submit-option.repository';
import { SubmitOptionService } from './submit-option.service';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';

@Module({
  controllers: [SubmitOptionController],
  providers: [SubmitOptionService, SubmitOptionRepository, QuestionRepository, QuestionOptionRepository, ExerciseRepository],
})
export class SubmitOptionModule {}
