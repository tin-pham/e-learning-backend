import { Kysely, Transaction as KyselyTransaction } from 'kysely';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { ParentEntity } from '../parent/parent.entity';

export interface KyselyTables {
  users: UserEntity;
  role: RoleEntity;
  userRole: UserRoleEntity;
  student: StudentEntity;
  teacher: TeacherEntity;
  parent: ParentEntity;
}

export type Transaction = KyselyTransaction<KyselyTables>;
export class DatabaseService extends Kysely<KyselyTables> {}
