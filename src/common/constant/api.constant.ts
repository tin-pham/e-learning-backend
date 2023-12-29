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
  CLASSROOM_YEAR: {
    TAGS: 'ClassroomYear',
    CONTROLLER: 'classroom-year',
    STORE: {
      ROUTE: '',
      OPERATION: 'Store classroom year',
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
};
