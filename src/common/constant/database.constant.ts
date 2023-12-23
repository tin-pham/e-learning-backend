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
      CREATED_BY: 'created_by',
    },
  },
  USER_ROLE: {
    NAME: 'user_role',
    SCHEMA: {
      USER_ID: 'user_id',
      ROLE_ID: 'role_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
    },
  },
  STUDENT: {
    NAME: 'student',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
      PARENT_ID: 'parent_id',
    },
  },
  TEACHER: {
    NAME: 'teacher',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
    },
  },
  PARENT: {
    NAME: 'parent',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
    },
  },
  STUDENT_PARENT: {
    NAME: 'student_parent',
    SCHEMA: {
      STUDENT_ID: 'student_id',
      PARENT_ID: 'parent_id',
    },
  },
  SUBJECT: {
    NAME: 'subject',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  GROUP: {
    NAME: 'group',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  SUBJECT_GROUP: {
    NAME: 'subject_group',
    SCHEMA: {
      SUBJECT_ID: 'subject_id',
      GROUP_ID: 'group_id',
    },
  },
};
