import { Module } from '@nestjs/common';
import { QuestionOptionController } from './question-option.controller';
import { QuestionOptionRepository } from './question-option.repository';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionService } from './question-option.service';

@Module({
  controllers: [QuestionOptionController],
  providers: [QuestionOptionService, QuestionOptionRepository, QuestionRepository],
})
export class QuestionOptionModule {}
