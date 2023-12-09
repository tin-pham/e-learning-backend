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
  },
};
