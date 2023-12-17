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
    FAILED_TO_CREATE: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'USER_FAILED_TO_CREATE',
      message: 'Failed to create user',
    },
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
    FAILED_TO_GET_DETAIL: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'USER_FAILED_TO_GET_DETAIL',
      message: 'Failed to get user detail',
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
};
