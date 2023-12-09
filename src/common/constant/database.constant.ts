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
      UPDATED_AT: 'updated_at',
      DELETED_AT: 'deleted_at',
    },
  },
  ROLE: {
    NAME: 'role',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at',
      DELETED_AT: 'deleted_at',
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
};
