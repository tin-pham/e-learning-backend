import { Kysely, Transaction as KyselyTransaction } from 'kysely';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { StudentEntity } from '../student/student.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { ParentEntity } from '../parent/parent.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { GroupEntity } from '../group/group.entity';
import { SubjectGroupEntity } from '../subject-group/subject-group.entity';
import { StudentParentEntity } from '../student-parent/student-parent.entity';
import { GradeEntity } from '../grade/grade.entity';
import { ClassroomEntity } from '../classroom/classroom.entity';
import { SemesterEntity } from '../semester/semester.entity';
import { YearEntity } from '../year/year.entity';
import { ClassroomYearEntity } from '../classroom-year/classroom-year.entity';
import { YearGradeEntity } from '../year-grade/year-grade.entity';
import { ClassroomYearStudentEntity } from '../classroom-year-student/classroom-year-student.entity';
import { TeacherSubjectEntity } from '../teacher-subject/teacher-subject.entity';
import { ClassroomYearAssignmentEntity } from '../classroom-year-assignment/classroom-year-assignment.entity';
import { MenuEntity } from '../menu/menu.entity';
import { RoleMenuEntity } from '../role-menu/role-menu.entity';
import { CourseEntity } from '../course/course.entity';
import { SectionEntity } from '../section/section.entity';
import { DifficultyEntity } from '../difficulty/difficulty.entity';
import { AnswerEntity } from '../answer/answer.entity';
import { QuestionEntity } from '../question/question.entity';
import { QuestionOptionEntity } from '../question-option/question-option.entity';
import { FileEntity } from '../file/file.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { LessonFileEntity } from '../lesson-file/lesson-file.entity';
import { VideoEntity } from '../video/video.entity';
import { LessonVideoEntity } from '../lesson-video/lesson-video.entity';
import { ExerciseEntity } from '../exercise/exercise.entity';
import { ExerciseQuestionEntity } from '../exercise-question/exercise-question.entity';
import { LessonCommentEntity } from '../lesson-comment/lesson-comment.entity';

export interface KyselyTables {
  users: UserEntity;
  role: RoleEntity;
  userRole: UserRoleEntity;
  student: StudentEntity;
  teacher: TeacherEntity;
  parent: ParentEntity;
  studentParent: StudentParentEntity;
  subject: SubjectEntity;
  group: GroupEntity;
  subjectGroup: SubjectGroupEntity;
  grade: GradeEntity;
  classroom: ClassroomEntity;
  semester: SemesterEntity;
  year: YearEntity;
  classroomYear: ClassroomYearEntity;
  yearGrade: YearGradeEntity;
  classroomYearStudent: ClassroomYearStudentEntity;
  teacherSubject: TeacherSubjectEntity;
  classroomYearAssignment: ClassroomYearAssignmentEntity;
  menu: MenuEntity;
  roleMenu: RoleMenuEntity;
  course: CourseEntity;
  section: SectionEntity;
  difficulty: DifficultyEntity;
  question: QuestionEntity;
  questionOption: QuestionOptionEntity;
  exercise: ExerciseEntity;
  exerciseQuestion: ExerciseQuestionEntity;
  answer: AnswerEntity;
  file: FileEntity;
  lesson: LessonEntity;
  lessonFile: LessonFileEntity;
  video: VideoEntity;
  lessonVideo: LessonVideoEntity;
  lessonComment: LessonCommentEntity;
}

export type Transaction = KyselyTransaction<KyselyTables>;
export class DatabaseService extends Kysely<KyselyTables> {}
