import { HttpStatus } from '@nestjs/common';

export const EXCEPTION = {
  APP: {
    EXCEED_RATE_LIMIT: {
      status: HttpStatus.TOO_MANY_REQUESTS,
      code: 'APP_EXCEED_RATE_LIMIT',
      message: 'Exceed rate limit',
    },
  },
  USER: {
    USERNAME_ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      code: 'USER_USERNAME_ALREADY_EXISTS',
      message: 'Username already exists',
    },
    EMAIL_ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      code: 'USER_EMAIL_ALREADY_EXISTS',
      message: 'Email already exists',
    },
    PHONE_ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      code: 'USER_PHONE_ALREADY_EXISTS',
      message: 'Phone already exists',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      code: 'USER_DOES_NOT_EXIST',
      message: 'User does not exist',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    },
  },
  AUTH: {
    USERNAME_OR_PASSWORD_INVALID: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Username or password invalid',
      code: 'AUTH_USERNAME_OR_PASSWORD_INVALID',
    },
    REFRESH_TOKEN_INVALID: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Refresh token invalid',
      code: 'AUTH_REFRESH_TOKEN_INVALID',
    },
    REFRESH_TOKEN_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Refresh token failed',
      code: 'AUTH_REFRESH_TOKEN_FAILED',
    },
    AUTHORIZE_FAILED: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Authorize failed',
      code: 'AUTH_AUTHORIZE_FAILED',
    },
    API_KEY_INVALID: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Api key invalid',
      code: 'AUTH_API_KEY_INVALID',
    },
    USER_DOES_NOT_HAVE_ROLES: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'User does not have roles',
      code: 'AUTH_USER_DOES_NOT_HAVE_ROLES',
    },
  },
  ROLE: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Role does not exist',
      code: 'ROLE_DOES_NOT_EXIST',
    },
  },
  STUDENT: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Student not found',
      code: 'STUDENT_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Student does not exist',
      code: 'STUDENT_DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list student',
      code: 'STUDENT_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail student',
      code: 'STUDENT_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store student',
      code: 'STUDENT_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update student',
      code: 'STUDENT_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete student',
      code: 'STUDENT_DELETE_FAILED',
    },
  },
  TEACHER: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Teacher not found',
      code: 'TEACHER_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Teacher does not exist',
      code: 'TEACHER_DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list teacher',
      code: 'TEACHER_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail teacher',
      code: 'TEACHER_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store teacher',
      code: 'TEACHER_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update teacher',
      code: 'TEACHER_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete teacher',
      code: 'TEACHER_DELETE_FAILED',
    },
  },
  PARENT: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Parent not found',
      code: 'PARENT_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Parent does not exist',
      code: 'PARENT_DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list parent',
      code: 'PARENT_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail parent',
      code: 'PARENT_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store parent',
      code: 'PARENT_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update parent',
      code: 'PARENT_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete parent',
      code: 'PARENT_DELETE_FAILED',
    },
  },
  STUDENT_PARENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Student parent already exist',
      code: 'STUDENT_PARENT_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Student parent does not exist',
      code: 'STUDENT_PARENT_DOES_NOT_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store student parent',
      code: 'STUDENT_PARENT_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete student parent',
      code: 'STUDENT_PARENT_BULK_DELETE_FAILED',
    },
  },
  SUBJECT: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Subject not found',
      code: 'SUBJECT_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Subject does not exist',
      code: 'SUBJECT_DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Subject already exist',
      code: 'SUBJECT_ALREADY_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list subject',
      code: 'SUBJECT_GET_LIST_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store subject',
      code: 'SUBJECT_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update subject',
      code: 'SUBJECT_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete subject',
      code: 'SUBJECT_DELETE_FAILED',
    },
  },
  GROUP: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Group not found',
      code: 'GROUP_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Group does not exist',
      code: 'GROUP_DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Group already exist',
      code: 'GROUP_ALREADY_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list group',
      code: 'GROUP_GET_LIST_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store group',
      code: 'GROUP_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update group',
      code: 'GROUP_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete group',
      code: 'GROUP_DELETE_FAILED',
    },
  },
  SUBJECT_GROUP: {
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store subject group',
      code: 'SUBJECT_GROUP_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete subject group',
      code: 'SUBJECT_GROUP_BULK_DELETE_FAILED',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Subject group already exist',
      code: 'SUBJECT_GROUP_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Subject group does not exist',
      code: 'SUBJECT_GROUP_DOES_NOT_EXIST',
    },
  },
  GRADE: {
    ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      message: 'Grade already exists',
      code: 'GRADE_ALREADY_EXISTS',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Grade does not exist',
      code: 'GRADE_DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list grade',
      code: 'GRADE_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail grade',
      code: 'GRADE_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store grade',
      code: 'GRADE_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update grade',
      code: 'GRADE_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete grade',
      code: 'GRADE_DELETE_FAILED',
    },
  },
  CLASSROOM: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Classroom not found',
      code: 'CLASSROOM_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Classroom does not exist',
      code: 'CLASSROOM_DOES_NOT_EXIST',
    },
    ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      message: 'Classroom already exists',
      code: 'CLASSROOM_ALREADY_EXISTS',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list classroom',
      code: 'CLASSROOM_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail classroom',
      code: 'CLASSROOM_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store classroom',
      code: 'CLASSROOM_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update classroom',
      code: 'CLASSROOM_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete classroom',
      code: 'CLASSROOM_DELETE_FAILED',
    },
  },
  YEAR: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Year does not exist',
      code: 'YEAR_DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store year',
      code: 'YEAR_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list year',
      code: 'YEAR_GET_LIST_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete year',
      code: 'YEAR_DELETE_FAILED',
    },
  },
};
