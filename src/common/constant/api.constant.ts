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
    STORE: {
      ROUTE: '',
      OPERATION: 'Store user',
    },
    STORE_BY_API_KEY: {
      ROUTE: 'store-by-api-key',
      OPERATION: 'Store user by api key',
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
  PARENT: {
    TAGS: 'Parent',
    CONTROLLER: 'parent',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store parent',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list parents',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get parent detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update parent',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete parent',
    },
  },
  STUDENT_PARENT: {
    TAGS: 'StudentParent',
    CONTROLLER: 'student-parent',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store student parent',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete student parent',
    },
  },
  SUBJECT: {
    TAGS: 'Subject',
    CONTROLLER: 'subject',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store subject',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list subjects',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get subject detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update subject',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete subject',
    },
  },
  GROUP: {
    TAGS: 'Group',
    CONTROLLER: 'group',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store group',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list groups',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get group detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update group',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete group',
    },
  },
  SUBJECT_GROUP: {
    TAGS: 'SubjectGroup',
    CONTROLLER: 'subject-group',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store subject groups',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete subject groups',
    },
  },
  CLASSROOM: {
    TAGS: 'Classroom',
    CONTROLLER: 'classroom',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store classroom',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list classrooms',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get classroom detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update classroom',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete classroom',
    },
  },
  GRADE: {
    TAGS: 'Grade',
    CONTROLLER: 'grade',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store grade',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list grades',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get grade detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update grade',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete grade',
    },
  },
  YEAR: {
    TAGS: 'Year',
    CONTROLLER: 'year',
    CREATE: {
      ROUTE: '',
      OPERATION: 'Create year',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list years',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete year',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update year',
    },
  },
  LEVEL: {
    TAGS: 'Level',
    CONTROLLER: 'level',
    CHOOSE: {
      ROUTE: '',
      OPERATION: 'Choose level',
    },
  },
  CLASSROOM_YEAR_STUDENT: {
    TAGS: 'ClassroomYearStudent',
    CONTROLLER: 'classroom-year-student',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store classroom year student',
    },
  },
  CLASSROOM_YEAR_ASSIGNMENT: {
    TAGS: 'ClassroomYearAssignment',
    CONTROLLER: 'classroom-year-assignment',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store classroom year assignment',
    },
  },
  TEACHER_SUBJECT: {
    TAGS: 'TeacherSubject',
    CONTROLLER: 'teacher-subject',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store teacher subject',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list teacher subject',
    },
  },
  CLASSROOM_YEAR: {
    TAGS: 'ClassroomYear',
    CONTROLLER: 'classroom-year',
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update classroom year',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get classroom year detail',
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
  ANSWER: {
    TAGS: 'Answer',
    CONTROLLER: 'answer',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store answer',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list answers',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get answer detail',
    },
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update answer',
    },
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete answer',
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
    UPDATE: {
      ROUTE: ':id',
      OPERATION: 'Update question option',
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
  FILE: {
    TAGS: 'File',
    CONTROLLER: 'file',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store file',
    },
    BULK_DELETE: {
      ROUTE: ':id',
      OPERATION: 'Bulk delete file',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list files',
    },
  },
  LESSON_FILE: {
    TAGS: 'LessonFile',
    CONTROLLER: 'lesson-file',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store lesson file',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete lesson file',
    },
  },
  VIDEO: {
    TAGS: 'Video',
    CONTROLLER: 'video',
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete video',
    },
    GET_LIST: {
      ROUTE: '',
      OPERATION: 'Get list videos',
    },
    UPLOAD: {
      ROUTE: '',
      OPERATION: 'Upload video',
    },
    GET_DETAIL: {
      ROUTE: ':id',
      OPERATION: 'Get video detail',
    },
  },
  LESSON_VIDEO: {
    TAGS: 'LessonVideo',
    CONTROLLER: 'lesson-video',
    BULK_STORE: {
      ROUTE: '',
      OPERATION: 'Bulk store lesson video',
    },
    BULK_DELETE: {
      ROUTE: '',
      OPERATION: 'Bulk delete lesson video',
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
    DELETE: {
      ROUTE: ':id',
      OPERATION: 'Delete exercise',
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
};
