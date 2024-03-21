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
import { SubmitOptionEntity } from '../submit-option/submit-option.entity';
import { AssignmentAttachmentEntity } from '../assignment-attachment/assignment-attachment.entity';
import { ExerciseSubmitEntity } from '../exercise-submit/exercise-submit.entity';
import { ExerciseSubmitOptionEntity } from '../exercise-submit-option/exercise-submit-option.entity';
import { ExerciseSubmitMarkEntity } from '../exercise-submit-mark/exercise-submit-mark.entity';
import { AssignmentExerciseEntity } from '../assignment-exercise/assignment-exercise.entity';
import { CategoryEntity } from '../category/category.entity';
import { CategoryCourseEntity } from '../category-course/category-course.entity';
import { AttachmentEntity } from '../attachment/attachment.entity';
import { ImageEntity } from '../image/image.entity';
import { UserImageEntity } from '../user-image/user-image.entity';
import { CourseImageEntity } from '../course-image/course-image.entity';
import { AssignmentSubmitEntity } from '../assignment-submit/assignment-submit.entity';
import { AssignmentSubmitGradeEntity } from '../assignment-submit-grade/assignment-submit-grade.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { CourseNotificationEntity } from '../course-notification/course-notification.entity';
import { CommentNotificationEntity } from '../comment-notification/comment-notification.entity';
import { LevelEntity } from '../level/level.entity';
import { LessonExerciseEntity } from '../lesson-exercise/lesson-exercise.entity';
import { QuestionCategoryHasQuestionEntity } from '../question-category-has-question/question-category-has-question.entity';
import { StudentExerciseEntity } from '../student-exercise/student-exercise.entity';
import { ExerciseQuestionSnapshotEntity } from '../exercise-question-snapshot/exercise-question-snapshot.entity';
import { ExerciseQuestionOptionSnapshotEntity } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.entity';
import { StudentExerciseOptionEntity } from 'src/student-exercise-option/student-exercise-option.entity';
import { StudentExerciseGradeEntity } from 'src/student-exercise-grade/student-exercise-grade.entity';
import { CourseOutcomeEntity } from 'src/course-outcome/course-outcome.entity';

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
  submitOption: SubmitOptionEntity;
  assignmentAttachment: AssignmentAttachmentEntity;
  lessonExercise: LessonExerciseEntity;
  exerciseSubmit: ExerciseSubmitEntity;
  exerciseSubmitOption: ExerciseSubmitOptionEntity;
  exerciseSubmitMark: ExerciseSubmitMarkEntity;
  assignmentExercise: AssignmentExerciseEntity;
  category: CategoryEntity;
  categoryCourse: CategoryCourseEntity;
  attachment: AttachmentEntity;
  image: ImageEntity;
  userImage: UserImageEntity;
  courseImage: CourseImageEntity;
  assignmentSubmit: AssignmentSubmitEntity;
  assignmentSubmitGrade: AssignmentSubmitGradeEntity;
  notification: NotificationEntity;
  userNotification: UserNotificationEntity;
  courseNotification: CourseNotificationEntity;
  commentNotification: CommentNotificationEntity;
  level: LevelEntity;
  questionCategoryHasQuestion: QuestionCategoryHasQuestionEntity;
  exerciseQuestionSnapshot: ExerciseQuestionSnapshotEntity;
  exerciseQuestionOptionSnapshot: ExerciseQuestionOptionSnapshotEntity;
  studentExercise: StudentExerciseEntity;
  studentExerciseOption: StudentExerciseOptionEntity;
  studentExerciseGrade: StudentExerciseGradeEntity;
  courseOutcome: CourseOutcomeEntity;
}

export type Transaction = KyselyTransaction<KyselyTables>;
export class DatabaseService extends Kysely<KyselyTables> {}
