import { Module } from '@nestjs/common';
import { QuestionCategoryController } from './question-category.controller';
import { QuestionCategoryRepository } from './question-category.repository';
import { QuestionCategoryService } from './question-category.service';

@Module({
  controllers: [QuestionCategoryController],
  providers: [QuestionCategoryRepository, QuestionCategoryService],
})
export class QuestionCategoryModule {}
