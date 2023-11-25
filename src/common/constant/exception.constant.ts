import { HttpStatus } from '@nestjs/common';

export const EXCEPTION = {
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
  },
};
