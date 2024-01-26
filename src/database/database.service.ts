import { Kysely, Transaction as KyselyTransaction } from 'kysely';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { MenuEntity } from '../menu/menu.entity';
import { RoleMenuEntity } from '../role-menu/role-menu.entity';
import { CourseEntity } from '../course/course.entity';
import { SectionEntity } from '../section/section.entity';
import { DifficultyEntity } from '../difficulty/difficulty.entity';
import { QuestionEntity } from '../question/question.entity';
import { QuestionOptionEntity } from '../question-option/question-option.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { ExerciseQuestionEntity } from '../exercise-question/exercise-question.entity';
import { LessonCommentEntity } from '../lesson-comment/lesson-comment.entity';
import { LessonAttachmentEntity } from '../lesson-attachment/lesson-attachment.entity';
import { ExerciseEntity } from '../exercise/exercise.entity';
import { CourseStudentEntity } from '../course-student/course-student.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { CourseAssignmentEntity } from '../course-assignment/course-assignment.entity';
import { QuestionCategoryEntity } from '../question-category/question-category.entity';
import { SubmitEntity } from '../submit/submit.entity';
import { SubmitOptionEntity } from '../submit-option/submit-option.entity';
import { AssignmentAttachmentEntity } from '../assignment-attachment/assignment-attachment.entity';
import { SectionExerciseEntity } from '../section-exercise/section-exercise.entity';
import { ExerciseSubmitEntity } from '../exercise-submit/exercise-submit.entity';

export interface KyselyTables {
  users: UserEntity;
  role: RoleEntity;
  userRole: UserRoleEntity;
  student: StudentEntity;
  teacher: TeacherEntity;
  menu: MenuEntity;
  roleMenu: RoleMenuEntity;
  course: CourseEntity;
  section: SectionEntity;
  difficulty: DifficultyEntity;
  question: QuestionEntity;
  questionOption: QuestionOptionEntity;
  exercise: ExerciseEntity;
  exerciseQuestion: ExerciseQuestionEntity;
  lesson: LessonEntity;
  lessonAttachment: LessonAttachmentEntity;
  lessonComment: LessonCommentEntity;
  courseStudent: CourseStudentEntity;
  assignment: AssignmentEntity;
  courseAssignment: CourseAssignmentEntity;
  questionCategory: QuestionCategoryEntity;
  submit: SubmitEntity;
  submitOption: SubmitOptionEntity;
  assignmentAttachment: AssignmentAttachmentEntity;
  sectionExercise: SectionExerciseEntity;
  exerciseSubmit: ExerciseSubmitEntity;
}

export type Transaction = KyselyTransaction<KyselyTables>;
export class DatabaseService extends Kysely<KyselyTables> {}
