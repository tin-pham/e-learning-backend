import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { DifficultyRepository } from '../difficulty/difficulty.repository';
import { QuestionCategoryHasQuestionRepository } from '../question-category-has-question/question-category-has-question.repository';
import { QuestionCategoryRepository } from '../question-category/question-category.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { QuestionService } from './question.service';
import { StudentExerciseGradeRepository } from 'src/student-exercise-grade/student-exercise-grade.repository';

@Module({
  controllers: [QuestionController],
  providers: [
    QuestionService,
    QuestionRepository,
    DifficultyRepository,
    QuestionCategoryHasQuestionRepository,
    QuestionCategoryRepository,
    QuestionOptionRepository,
    StudentExerciseGradeRepository,
  ],
})
export class QuestionModule {}
