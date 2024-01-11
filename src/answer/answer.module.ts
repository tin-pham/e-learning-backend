import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerRepository } from './answer.repository';
import { AnswerService } from './answer.service';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';

@Module({
  controllers: [AnswerController],
  providers: [AnswerService, AnswerRepository, QuestionRepository, QuestionOptionRepository],
})
export class AnswerModule {}
