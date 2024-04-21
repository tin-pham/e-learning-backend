import { Module } from '@nestjs/common';
import { QuestionCategoryController } from './question-category.controller';
import { QuestionCategoryRepository } from './question-category.repository';
import { QuestionRepository } from '../question/question.repository';
import { QuestionCategoryHasQuestionRepository } from '../question-category-has-question/question-category-has-question.repository';
import { QuestionCategoryService } from './question-category.service';

@Module({
  controllers: [QuestionCategoryController],
  providers: [QuestionCategoryRepository, QuestionCategoryService, QuestionRepository, QuestionCategoryHasQuestionRepository],
})
export class QuestionCategoryModule {}
