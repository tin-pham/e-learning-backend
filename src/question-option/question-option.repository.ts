import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { QuestionOptionEntity } from './question-option.entity';
import { QuestionOptionGetListDTO } from './dto/question-option.dto';

@Injectable()
export class QuestionOptionRepository {
  constructor(private readonly database: DatabaseService) {}

  updateWithTransaction(transaction: Transaction, id: number, entity: Partial<QuestionOptionEntity>) {
    return transaction
      .updateTable('questionOption')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'questionId', 'isCorrect'])
      .executeTakeFirst();
  }

  getIdsByQuestionIds(questionIds: number[]) {
    return this.database
      .selectFrom('questionOption')
      .select(['id'])
      .where('deletedAt', 'is', null)
      .where('questionId', 'in', questionIds)
      .execute();
  }

  findByIds(ids: number[]) {
    return this.database
      .selectFrom('questionOption')
      .select(['id', 'text', 'questionId', 'isCorrect'])
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteByIdsWithTransaction(transaction: Transaction, ids: number[], actorId: number) {
    return transaction.updateTable('questionOption').set({ deletedAt: new Date(), deletedBy: actorId }).where('id', 'in', ids).execute();
  }

  async countByIdsAndQuestionId(ids: number[], questionId: number) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('questionId', '=', questionId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultipleWithTransaction(transaction: Transaction, options: QuestionOptionEntity[]) {
    return transaction.insertInto('questionOption').values(options).execute();
  }

  getCorrectIdByQuestionId(questionId: number) {
    return this.database
      .selectFrom('questionOption')
      .select(['id'])
      .where('deletedAt', 'is', null)
      .where('questionId', '=', questionId)
      .where('isCorrect', '=', true)
      .execute();
  }

  find(dto: QuestionOptionGetListDTO) {
    const { page, limit, questionId } = dto;

    const withQuestion = Boolean(questionId);

    const query = this.database
      .selectFrom('questionOption')
      .select(['id', 'text', 'questionId', 'isCorrect'])
      .where('deletedAt', 'is', null)
      .orderBy('id', 'asc')
      .$if(withQuestion, (qb) => qb.where('questionId', '=', questionId));

    return paginate(query, {
      page,
      limit,
    });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('questionOption')
      .select(['id', 'text', 'questionId', 'isCorrect'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  insert(entity: QuestionOptionEntity) {
    return this.database
      .insertInto('questionOption')
      .values(entity)
      .returning(['id', 'text', 'questionId', 'isCorrect'])
      .executeTakeFirst();
  }

  update(id: number, entity: QuestionOptionEntity) {
    return this.database
      .updateTable('questionOption')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'questionId', 'isCorrect'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('questionOption')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'questionId', 'isCorrect'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByQuestionIdAndCorrect(questionId: number) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .innerJoin('question', 'question.id', 'questionOption.questionId')
      .where('questionOption.questionId', '=', questionId)
      .where('questionOption.isCorrect', '=', true)
      .where('questionOption.deletedAt', 'is', null)
      .where('question.deletedAt', 'is', null)
      .where('question.isMultipleChoice', '=', false)
      .executeTakeFirst();
    return Number(count);
  }

  async countByQuestionIdAndText(questionId: number, text: string) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('questionId', '=', questionId)
      .where('text', '=', text)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByQuestionIdAndTextExceptId(questionId: number, text: string, id: number) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('questionId', '=', questionId)
      .where('text', '=', text)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getQuestionIdById(id: number) {
    return this.database
      .selectFrom('questionOption')
      .select(['questionId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findByQuestionId(questionId: number) {
    return this.database
      .selectFrom('questionOption')
      .select(['id', 'text', 'questionId', 'isCorrect', 'deletedAt'])
      .where('deletedAt', 'is', null)
      .where('questionId', '=', questionId)
      .orderBy('id', 'asc')
      .execute();
  }

  // findDeletedByExerciseId(exerciseId: number) {
  //   return this.database
  //     .with('last_entries', (qb) =>
  //       qb
  //         .selectFrom('exerciseQuestion')
  //         .select(({ fn }) => ['exerciseId', 'questionId', fn.max('createdAt').as('lastCreationTime')])
  //         .where('exerciseId', '=', exerciseId)
  //         .groupBy(['exerciseId', 'questionId']),
  //     )
  //     .selectFrom('exerciseQuestion')
  //     .innerJoin('last_entries', (join) =>
  //       join
  //         .onRef('last_entries.exerciseId', '=', 'exerciseQuestion.exerciseId')
  //         .onRef('last_entries.questionId', '=', 'exerciseQuestion.questionId'),
  //     )
  //     .where('exerciseQuestion.deletedAt', 'is not', null)
  //     .whereRef('exerciseQuestion.createdAt', '=', 'last_entries.lastCreationTime')
  //     .innerJoin('question', 'question.id', 'exerciseQuestion.questionId')
  //     .select([
  //       'question.id as questionId',
  //       'question.text as questionText',
  //       'question.difficultyId as questionDifficultyId',
  //       'question.isMultipleChoice as questionIsMultipleChoice',
  //       'question.deletedAt as questionDeletedAt',
  //       'exerciseQuestion.deletedAt',
  //     ])
  //     .execute();
  // }
  //
  findDeletedByQuestionId(questionId: number) {
    // return this.database
    //   .selectFrom('questionOption')
    //   .select(['id', 'text', 'questionId', 'isCorrect', 'deletedAt'])
    //   .where('questionId', '=', questionId)
    //   .where('deletedAt', 'is not', null)
    //   .orderBy('id', 'asc')
    //   .execute();
    return this.database
      .with('last_entries', (qb) =>
        qb
          .selectFrom('questionOption')
          .select(({ fn }) => ['id', 'questionId', fn.max('createdAt').as('lastCreationTime')])
          .where('questionId', '=', questionId)
          .groupBy(['id', 'questionId']),
      )
      .selectFrom('questionOption')
      .innerJoin('last_entries', (join) =>
        join.onRef('last_entries.questionId', '=', 'questionOption.questionId').onRef('last_entries.id', '=', 'questionOption.id'),
      )
      .where('questionOption.deletedAt', 'is not', null)
      .whereRef('questionOption.createdAt', '=', 'last_entries.lastCreationTime')
      .select([
        'questionOption.id',
        'questionOption.text',
        'questionOption.questionId',
        'questionOption.isCorrect',
        'questionOption.deletedAt',
      ])
      .execute();
  }
}
