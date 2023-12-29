import { GradeEntity } from 'src/grade/grade.entity';
import { DatabaseService } from '../database';

const ids: string[] = [];

export async function up(database: DatabaseService): Promise<void> {
  const gradesData: GradeEntity[] = [];

  for (let i = 10; i <= 12; i++) {
    const grade = new GradeEntity();
    grade.name = `${i}`;
    gradesData.push(grade);
  }

  const grades = await database
    .insertInto('grade')
    .values(gradesData)
    .returning('id')
    .execute();

  grades.forEach((grade) => {
    ids.push(grade.id);
  });
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('grade').where('id', 'in', ids).execute();
}
