import { Module } from '@nestjs/common';
import { ExerciseQuestionController } from './exercise-question.controller';
import { ExerciseQuestionService } from './exercise-question.service';
import { ExerciseQuestionRepository } from './exercise-question.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { QuestionRepository } from '../question/question.repository';

@Module({
  controllers: [ExerciseQuestionController],
  providers: [ExerciseQuestionService, ExerciseQuestionRepository, ExerciseRepository, QuestionRepository],
})
export class ExerciseQuestionModule {}
