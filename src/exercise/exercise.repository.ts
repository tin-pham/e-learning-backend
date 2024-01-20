import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseGetListDTO } from './dto/exercise.dto';
import { paginate } from '../common/function/paginate';
import { jsonBuildObject } from 'kysely/helpers/postgres';

@Injectable()
export class ExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: ExerciseEntity) {
    return this.database.insertInto('exercise').values(entity).returning(['id', 'name']).executeTakeFirst();
  }

  find(dto: ExerciseGetListDTO) {
    const { limit, page } = dto;
    const query = this.database.selectFrom('exercise').select(['id', 'name']).where('deletedAt', 'is', null);

    return paginate(query, { limit, page });
  }

  update(id: number, entity: ExerciseEntity) {
    return this.database
      .updateTable('exercise')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name'])
      .executeTakeFirst();
  }

  async findOneById(id: number) {
    return this.database
      .with('exercise_data', (qb) =>
        qb
          .selectFrom('exercise')
          .leftJoin('exerciseQuestion', (join) =>
            join.onRef('exerciseQuestion.exerciseId', '=', 'exercise.id').on('exerciseQuestion.deletedAt', 'is', null),
          )
          .leftJoin('question', (join) =>
            join.onRef('question.id', '=', 'exerciseQuestion.questionId').on('question.deletedAt', 'is', null),
          )
          .where('exercise.deletedAt', 'is', null)
          .select(['exercise.id', 'exercise.name', 'question.id as question_id']),
      )
      .with('question_data', (qb) =>
        qb
          .selectFrom('question')
          .leftJoin('questionOption', (join) =>
            join.onRef('questionOption.questionId', '=', 'question.id').on('questionOption.deletedAt', 'is', null),
          )
          .where('question.deletedAt', 'is', null)
          .groupBy(['question.id', 'question.text'])
          .select(({ fn, ref }) => [
            'question.id',
            'question.text',
            fn
              .coalesce(
                fn
                  .jsonAgg(
                    jsonBuildObject({
                      id: ref('questionOption.id'),
                      text: ref('questionOption.text'),
                      isCorrect: ref('questionOption.isCorrect'),
                    }),
                  )
                  .filterWhere('questionOption.id', 'is not', null),
                sql`'[]'`,
              )
              .as('options'),
          ]),
      )
      .selectFrom('exercise_data')
      .leftJoin('question_data', 'question_data.id', 'exercise_data.question_id')
      .where('exercise_data.id', '=', id)
      .groupBy(['exercise_data.id', 'exercise_data.name'])
      .select(({ fn, ref }) => [
        'exercise_data.id',
        'exercise_data.name',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('question_data.id'),
                  text: ref('question_data.text'),
                  options: ref('question_data.options'),
                }),
              )
              .filterWhere('question_data.id', 'is not', null),
            sql`'[]'`,
          )
          .as('questions'),
      ])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('exercise')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('exercise')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('exercise')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
