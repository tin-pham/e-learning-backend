export const DATABASE_TABLE = {
  USERS: {
    NAME: 'users',
    SCHEMA: {
      ID: 'id',
      USERNAME: 'username',
      PASSWORD: 'password',
      DISPLAY_NAME: 'display_name',
      PHONE: 'phone',
      EMAIL: 'email',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  ROLE: {
    NAME: 'role',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
    },
  },
  USER_ROLE: {
    NAME: 'user_role',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
      ROLE_ID: 'role_id',
      CREATED_AT: 'created_at',
    },
  },
  STUDENT: {
    NAME: 'student',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
    },
  },
};
