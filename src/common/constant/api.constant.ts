export const API = {
  AUTH: {
    TAGS: 'Auth',
    CONTROLLER: 'auth',
    SIGNIN: {
      ROUTE: 'sign-in',
      OPERATION: 'Signin',
    },
    REFRESH_TOKEN: {
      ROUTE: 'refresh-token',
      OPERATION: 'Refresh token',
    },
  },
  USER: {
    TAGS: 'User',
    CONTROLLER: 'user',
    GET_PROFILE: {
      ROUTE: 'profile',
      OPERATION: 'Get profile',
    },
    UPDATE: {
      ROUTE: 'profile',
      OPERATION: 'Update profile',
    },
  },
  HEALTH: {
    TAGS: 'Health',
    CONTROLLER: 'health',
    CHECK: {
      ROUTE: 'check',
      OPERATION: 'Check health',
    },
  },
  LOG: {
    TAGS: 'Log',
    CONTROLLER: 'log',
    GET_ERROR: {
      ROUTE: 'error',
      OPERATION: 'Get error logs',
    },
    GET_INFO: {
      ROUTE: 'info',
      OPERATION: 'Get info logs',
    },
  },
  ROLE: {
    TAGS: 'Role',
    CONTROLLER: 'role',
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list roles',
    },
  },
  STUDENT: {
    TAGS: 'Student',
    CONTROLLER: 'student',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store student',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list students',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get student detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update student',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete student',
    },
  },
  TEACHER: {
    TAGS: 'Teacher',
    CONTROLLER: 'teacher',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store teacher',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list teachers',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get teacher detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update teacher',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete teacher',
    },
  },
  S3: {
    TAGS: 'S3',
    CONTROLLER: 's3',
    BULK_UPLOAD: {
      ROUTE: '',
      OPERATION: 'Bulk upload files to s3',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete files from s3',
    },
  },
  MENU: {
    TAGS: 'Menu',
    CONTROLLER: 'menu',
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list menus',
    },
  },
  ROLE_MENU: {
    TAGS: 'RoleMenu',
    CONTROLLER: 'role-menu',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store role menu',
    },
  },
  COURSE: {
    TAGS: 'Course',
    CONTROLLER: 'course',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store course',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list courses',
    },
    TEACHER_GET_LIST: {
      ROUTE: 'teacher',
      OPERATION: 'Get list courses by teacher',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get course detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update course',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete course',
    },
  },
  SECTION: {
    TAGS: 'Section',
    CONTROLLER: 'section',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store section',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list sections',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get section detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update section',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete section',
    },
  },
  QUESTION: {
    TAGS: 'Question',
    CONTROLLER: 'question',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store question',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list questions',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get question detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update question',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete question',
    },
  },
  QUESTION_OPTION: {
    TAGS: 'QuestionOption',
    CONTROLLER: 'question-option',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store question option',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list question options',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get question option detail',
    },
    BULK_UPDATE: {
      ROUTE: 'bulk-update',
      OPERATION: 'Bulk update question option',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete question option',
    },
  },
  DIFFICULTY: {
    TAGS: 'Difficulty',
    CONTROLLER: 'difficulty',
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list difficulties',
    },
  },
  LESSON_ATTACHMENT: {
    TAGS: 'LessonAttachment',
    CONTROLLER: 'lesson-attachment',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store lesson attachment',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete lesson attachment',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list lesson attachments',
    },
  },
  ATTACHMENT: {
    TAGS: 'Attachment',
    CONTROLLER: 'attachment',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store attachment',
    },
    BULK_STORE: {
      ROUTE: 'bulk',
      OPERATION: 'Bulk store attachment',
    },
    BULK_DELETE: {
      ROUTE: 'bulk',
      OPERATION: 'Bulk delete attachment',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list attachments',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get attachment detail',
    },
  },
  EXERCISE: {
    TAGS: 'Exercise',
    CONTROLLER: 'exercise',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store exercise',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list exercises',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get exercise detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update exercise',
    },
    ACTIVATE: {
      ROUTE: 'activate/:id',
      OPERATION: 'Activate exercise',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete exercise',
    },
    SYNC: {
      ROUTE: 'sync/:id',
      OPERATION: 'Sync exercise',
    },
  },
  EXERCISE_QUESTION: {
    TAGS: 'ExerciseQuestion',
    CONTROLLER: 'exercise-question',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store exercise question',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete exercise question',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list exercise questions',
    },
  },
  LESSON: {
    TAGS: 'Lesson',
    CONTROLLER: 'lesson',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store lesson',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list lessons',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get lesson detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update lesson',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete lesson',
    },
  },
  LESSON_COMMENT: {
    TAGS: 'LessonComment',
    CONTROLLER: 'lesson-comment',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store lesson comment',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list lesson comments',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get lesson comment detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update lesson comment',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete lesson comment',
    },
  },
  COURSE_STUDENT: {
    TAGS: 'CourseStudent',
    CONTROLLER: 'course-student',
    UN_REGISTER: {
      ROUTE: 'un-register',
      OPERATION: 'UnRegister course student',
    },
    IS_REGISTERED: {
      ROUTE: 'is-registered',
      OPERATION: 'Is register course student',
    },
    REGISTER: {
      ROUTE: 'register',
      OPERATION: 'Register course student',
    },
    CHECK_REGISTERED: {
      ROUTE: 'check-registered',
      OPERATION: 'Check registered course student',
    },
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store course student',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete course student',
    },
  },
  ASSIGNMENT: {
    TAGS: 'Assignment',
    CONTROLLER: 'assignment',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store assignment',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list assignments',
    },
    GET_MY_LIST: {
      ROUTE: 'my-list',
      OPERATION: 'Get my assignments',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get assignment detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update assignment',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete assignment',
    },
    GET_SUBMISSION: {
      ROUTE: ':id/submission',
      OPERATION: 'Get assignment submission',
    },
    GET_STATISTIC: {
      ROUTE: ':id/statistic',
      OPERATION: 'Get assignment statistic',
    },
  },
  QUESTION_CATEGORY: {
    TAGS: 'QuestionCategory',
    CONTROLLER: 'question-category',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store question category',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list question categories',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get question category detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update question category',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete question category',
    },
  },
  SUBMIT_OPTION: {
    TAGS: 'SubmitOption',
    CONTROLLER: 'submit-option',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store submit option',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update submit option',
    },
  },
  ASSIGNMENT_ATTACHMENT: {
    TAGS: 'AssignmentAttachment',
    CONTROLLER: 'assignment-attachment',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store assignment attachment',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete assignment attachment',
    },
  },
  ASSIGNMENT_SUBMIT: {
    TAGS: 'AssignmentSubmit',
    CONTROLLER: 'assignment-submit',
    GET_STATISTIC: {
      ROUTE: 'statistic',
      OPERATION: 'Get assignment submit statistic',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete assignment submit',
    },
    STORE: {
      ROUTE: '',
      OPERATION: 'Store assignment submit',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list assignment submits',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get assignment submit detail',
    },
    GET_GRADE: {
      ROUTE: ':id/grade',
      OPERATION: 'Get assignment submit grade',
    },
  },
  EXERCISE_SUBMIT: {
    TAGS: 'ExerciseSubmit',
    CONTROLLER: 'exercise-submit',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store exercise submit',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list exercise submits',
    },
  },
  EXERCISE_SUBMIT_OPTION: {
    TAGS: 'ExerciseSubmitOption',
    CONTROLLER: 'exercise-submit-option',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store exercise submit option',
    },
  },
  EXERCISE_SUBMIT_MARK: {
    TAGS: 'ExerciseSubmitMark',
    CONTROLLER: 'exercise-submit-mark',
    CALCULATE: {
      ROUTE: '',
      OPERATION: 'Calculate exercise submit mark',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete exercise submit mark',
    },
  },
  STUDENT_EXERCISE_GRADE: {
    TAGS: 'StudentExerciseGrade',
    CONTROLLER: 'student-exercise-grade',
    CALCULATE: {
      ROUTE: '',
      OPERATION: 'Calculate student exercise grade',
    },
    BULK_CALCULATE: {
      ROUTE: 'bulk',
      OPERATION: 'Bulk calculate student exercise grade',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete student exercise grade',
    },
  },
  ASSIGNMENT_EXERCISE: {
    TAGS: 'AssignmentExercise',
    CONTROLLER: 'assignment-exercise',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store assignment exercise',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete assignment exercise',
    },
  },
  CATEGORY: {
    TAGS: 'Category',
    CONTROLLER: 'category',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store category',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list categories',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get category detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update category',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete category',
    },
  },
  IMAGE: {
    TAGS: 'Image',
    CONTROLLER: 'image',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store image',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete image',
    },
  },
  USER_IMAGE: {
    TAGS: 'UserImage',
    CONTROLLER: 'user-image',
    UPSERT: {
      ROUTE: 'upsert',
      OPERATION: 'Upsert user image',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete user image',
    },
  },
  COURSE_IMAGE: {
    TAGS: 'CourseImage',
    CONTROLLER: 'course-image',
    UPSERT: {
      ROUTE: 'upsert/:courseId',
      OPERATION: 'Upsert course image',
    },
  },
  ASSIGNMENT_SUBMIT_GRADE: {
    TAGS: 'AssignmentSubmitGrade',
    CONTROLLER: 'assignment-submit-grade',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store assignment submit grade',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete assignment submit grade',
    },
  },
  CATEGORY_COURSE: {
    TAGS: 'CategoryCourse',
    CONTROLLER: 'category-course',
    DELETE: {
      ROUTE: 'delete',
      OPERATION: 'Delete category course',
    },
  },
  NOTIFICATION: {
    TAGS: 'Notification',
    CONTROLLER: 'notification',
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list notifications',
    },
    STORE: {
      ROUTE: '',
      OPERATION: 'Store notification',
    },
  },
  USER_NOTIFICATION: {
    TAGS: 'UserNotification',
    CONTROLLER: 'user-notification',
    BULK_UPDATE: {
      ROUTE: 'bulk-update',
      OPERATION: 'Bulk update user notification',
    },
    BULK_DELETE: {
      ROUTE: 'bulk-delete',
      OPERATION: 'Bulk delete user notification',
    },
  },
  LEVEL: {
    TAGS: 'Level',
    CONTROLLER: 'level',
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list levels',
    },
  },
  STUDENT_EXERCISE: {
    TAGS: 'StudentExercise',
    CONTROLLER: 'student-exercise',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store student exercise',
    },
    SUBMIT: {
      ROUTE: 'submit/:id',
      OPERATION: 'Submit student exercise',
    },
    GET_SUBMITTED_LIST: {
      ROUTE: 'submit',
      OPERATION: 'Get submitted list student exercise',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete student exercise',
    },
  },
  EXERCISE_QUESTION_SNAPSHOT: {
    TAGS: 'ExerciseQuestionSnapshot',
    CONTROLLER: 'exercise-question-snapshot',
    STUDENT_GET_LIST: {
      ROUTE: 'student',
      OPERATION: 'Get list exercise question snapshot',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list exercise question snapshot',
    },
  },
  COURSE_OUTCOME: {
    TAGS: 'CourseOutcome',
    CONTROLLER: 'course-outcome',
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list course outcomes',
    },
    STORE: {
      ROUTE: '',
      OPERATION: 'Store course outcome',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update course outcome',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete course outcome',
    },
  },
  POST: {
    TAGS: 'Post',
    CONTROLLER: 'post',
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get post detail',
    },
    STORE: {
      ROUTE: '',
      OPERATION: 'Store post',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update post',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete post',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list posts',
    },
  },
  POST_ATTACHMENT: {
    TAGS: 'PostAttachment',
    CONTROLLER: 'post-attachment',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store post attachment',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete post attachment',
    },
  },
};
