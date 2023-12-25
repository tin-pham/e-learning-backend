import { DatabaseService } from '../database';
import { SEMESTER } from '../semester/enum/semester.enum';

const semesterNames = Object.values(SEMESTER);
const semestersData = semesterNames.map((name) => ({
  name,
}));

export async function up(database: DatabaseService): Promise<void> {
  console.log(semestersData);
  await database
    .insertInto('semester')
    .values(semestersData)
    .executeTakeFirstOrThrow();
}

export async function down(database: DatabaseService): Promise<void> {
  await database
    .deleteFrom('semester')
    .where('name', 'in', semesterNames)
    .executeTakeFirstOrThrow();
}
