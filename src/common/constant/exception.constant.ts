import { HttpStatus } from '@nestjs/common';

export const EXCEPTION = {
  APP: {
    EXCEED_RATE_LIMIT: {
      status: HttpStatus.TOO_MANY_REQUESTS,
      code: 'APP.EXCEED_RATE_LIMIT',
      message: 'Exceed rate limit',
    },
  },
  USER: {
    USERNAME_ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      code: 'USER.USERNAME_ALREADY_EXISTS',
      message: 'Username already exists',
    },
    EMAIL_ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      code: 'USER.EMAIL_ALREADY_EXISTS',
      message: 'Email already exists',
    },
    PHONE_ALREADY_EXISTS: {
      status: HttpStatus.CONFLICT,
      code: 'USER.PHONE_ALREADY_EXISTS',
      message: 'Phone already exists',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      code: 'USER.DOES_NOT_EXIST',
      message: 'User does not exist',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      code: 'USER.NOT_FOUND',
      message: 'User not found',
    },
    GET_PROFILE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'USER.GET_PROFILE_FAILED',
      message: 'Failed to get profile',
    },
    UPDATE_PROFILE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'USER.UPDATE_PROFILE_FAILED',
      message: 'Failed to update profile',
    },
  },
  AUTH: {
    SIGNIN_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Signin failed',
      code: 'AUTH.SIGNIN_FAILED',
    },
    SIGNOUT_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Signout failed',
      code: 'AUTH.SIGNOUT_FAILED',
    },
    USERNAME_OR_PASSWORD_INVALID: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Username or password invalid',
      code: 'AUTH.USERNAME_OR_PASSWORD_INVALID',
    },
    REFRESH_TOKEN_INVALID: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Refresh token invalid',
      code: 'AUTH.REFRESH_TOKEN_INVALID',
    },
    REFRESH_TOKEN_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Refresh token failed',
      code: 'AUTH.REFRESH_TOKEN_FAILED',
    },
    AUTHORIZE_FAILED: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Authorize failed',
      code: 'AUTH.AUTHORIZE_FAILED',
    },
    API_KEY_INVALID: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Api key invalid',
      code: 'AUTH.API_KEY_INVALID',
    },
    USER_DOES_NOT_HAVE_ROLES: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'User does not have roles',
      code: 'AUTH.USER_DOES_NOT_HAVE_ROLES',
    },
  },
  ROLE: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Role does not exist',
      code: 'ROLE.DOES_NOT_EXIST',
    },
  },
  STUDENT: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Student not found',
      code: 'STUDENT.NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Student does not exist',
      code: 'STUDENT.DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list student',
      code: 'STUDENT.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail student',
      code: 'STUDENT.GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store student',
      code: 'STUDENT.STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update student',
      code: 'STUDENT.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete student',
      code: 'STUDENT.DELETE_FAILED',
    },
  },
  TEACHER: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Teacher not found',
      code: 'TEACHER.NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Teacher does not exist',
      code: 'TEACHER.DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list teacher',
      code: 'TEACHER.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail teacher',
      code: 'TEACHER.GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store teacher',
      code: 'TEACHER.STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update teacher',
      code: 'TEACHER.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete teacher',
      code: 'TEACHER.DELETE_FAILED',
    },
  },
  S3: {
    UPLOAD_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload file',
      code: 'S3.UPLOAD_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete file',
      code: 'S3.DELETE_FAILED',
    },
  },
  MENU: {
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list menu',
      code: 'MENU.GET_LIST_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Menu does not exist',
      code: 'MENU.DOES_NOT_EXIST',
    },
  },
  ROLE_MENU: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Role menu already exist',
      code: 'ROLE.MENU_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store role menu',
      code: 'ROLE.MENU_BULK_STORE_FAILED',
    },
  },
  COURSE: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course already exist',
      code: 'COURSE.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course does not exist',
      code: 'COURSE.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Course not found',
      code: 'COURSE.NOT_FOUND',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list course',
      code: 'COURSE.GET_LIST_FAILED',
    },
    TEACHER_GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list course for teacher',
      code: 'COURSE.TEACHER_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail course',
      code: 'COURSE.GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store course',
      code: 'COURSE.STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update course',
      code: 'COURSE.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete course',
      code: 'COURSE.DELETE_FAILED',
    },
  },
  SECTION: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Section already exist',
      code: 'SECTION.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Section does not exist',
      code: 'SECTION.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Section not found',
      code: 'SECTION.NOT_FOUND',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list section',
      code: 'SECTION.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail section',
      code: 'SECTION.GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store section',
      code: 'SECTION.STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update section',
      code: 'SECTION.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete section',
      code: 'SECTION.DELETE_FAILED',
    },
  },
  QUESTION: {
    REMOVE_AND_UPDATE_OPTIONS_NOT_DISTINCT: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Remove and update options not distinct',
      code: 'QUESTION.REMOVE_AND_UPDATE_OPTIONS_NOT_DISTINCT',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question already exist',
      code: 'QUESTION.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question does not exist',
      code: 'QUESTION.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Question not found',
      code: 'QUESTION.NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store question',
      code: 'QUESTION.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question',
      code: 'QUESTION.GET_LIST_FAILED',
    },
    STUDENT_GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question for student',
      code: 'QUESTION.STUDENT_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail question',
      code: 'QUESTION.GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update question',
      code: 'QUESTION.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete question',
      code: 'QUESTION.DELETE_FAILED',
    },
  },
  QUESTION_OPTION: {
    BULK_UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk update question option',
      code: 'QUESTION_OPTION.BULK_UPDATE_FAILED',
    },
    IS_CORRECT_TRUE_REQUIRED: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question option is correct true required',
      code: 'QUESTION_OPTION.IS_CORRECT_TRUE_REQUIRED',
    },
    IS_CORRECT_DIVERSITY_REQUIRED: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question option is correct diversity required',
      code: 'QUESTION_OPTION.IS_CORRECT_DIVERSITY_REQUIRED',
    },
    TEXT_DUPLICATE: {
      status: HttpStatus.CONFLICT,
      message: 'Question option text duplicate',
      code: 'QUESTION_OPTION.TEXT_DUPLICATE',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question option already exist',
      code: 'QUESTION_OPTION.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question option does not exist',
      code: 'QUESTION_OPTION.DOES_NOT_EXIST',
    },
    DOES_NOT_BELONG_TO_QUESTION: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question option does not belong to question',
      code: 'QUESTION_OPTION.DOES_NOT_BELONG_TO_QUESTION',
    },
    IS_CORRECT_DUPLICATE: {
      status: HttpStatus.CONFLICT,
      message: 'Question option is correct duplicate',
      code: 'QUESTION_OPTION.IS_CORRECT_DUPLICATE',
    },
    IS_CORRECT_ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question option is correct already exist',
      code: 'QUESTION_OPTION.IS_CORRECT_ALREADY_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Question option not found',
      code: 'QUESTION_OPTION.NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store question option',
      code: 'QUESTION_OPTION.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question option',
      code: 'QUESTION_OPTION.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail question option',
      code: 'QUESTION_OPTION.GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update question option',
      code: 'QUESTION_OPTION.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete question option',
      code: 'QUESTION_OPTION.DELETE_FAILED',
    },
  },
  DIFFICULTY: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Difficulty does not exist',
      code: 'DIFFICULTY.DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list difficulty',
      code: 'DIFFICULTY.GET_LIST_FAILED',
    },
  },
  LESSON: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson does not exist',
      code: 'LESSON.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Lesson not found',
      code: 'LESSON.NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store lesson',
      code: 'LESSON.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list lesson',
      code: 'LESSON.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail lesson',
      code: 'LESSON.GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update lesson',
      code: 'LESSON.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete lesson',
      code: 'LESSON.DELETE_FAILED',
    },
  },
  LESSON_FILE: {
    ALREADY_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson file already exist',
      code: 'LESSON_FILE.ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store lesson file',
      code: 'LESSON_FILE.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete lesson file',
      code: 'LESSON_FILE.BULK_DELETE_FAILED',
    },
  },
  LESSON_ATTACHMENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Lesson attachment already exist',
      code: 'LESSON_ATTACHMENT.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson attachment does not exist',
      code: 'LESSON_ATTACHMENT.DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list lesson attachment',
      code: 'LESSON_ATTACHMENT.GET_LIST_FAILED',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store lesson attachment',
      code: 'LESSON_ATTACHMENT.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete lesson attachment',
      code: 'LESSON_ATTACHMENT.BULK_DELETE_FAILED',
    },
  },
  EXERCISE: {
    CANNOT_ACTIVATE_WITHOUT_QUESTION: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Cannot activate exercise without question',
      code: 'EXERCISE.CANNOT_ACTIVATE_WITHOUT_QUESTION',
    },
    ALREADY_ACTIVATED: {
      status: HttpStatus.CONFLICT,
      message: 'Exercise already activated',
      code: 'EXERCISE.ALREADY_ACTIVATED',
    },
    ACTIVATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to activate exercise',
      code: 'EXERCISE.ACTIVATE_FAILED',
    },
    CANNOT_UPDATE_ACTIVATED_EXERCISE: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Cannot update activated exercise',
      code: 'EXERCISE.CANNOT_UPDATE_ACTIVATED_EXERCISE',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store exercise',
      code: 'EXERCISE.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list exercise',
      code: 'EXERCISE.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail exercise',
      code: 'EXERCISE.GET_DETAIL_FAILED',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Exercise not found',
      code: 'EXERCISE.NOT_FOUND',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update exercise',
      code: 'EXERCISE.UPDATE_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise does not exist',
      code: 'EXERCISE.DOES_NOT_EXIST',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete exercise',
      code: 'EXERCISE.DELETE_FAILED',
    },
  },
  EXERCISE_QUESTION: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Exercise question already exist',
      code: 'EXERCISE_QUESTION.ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store exercise question',
      code: 'EXERCISE_QUESTION.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete exercise question',
      code: 'EXERCISE_QUESTION.BULK_DELETE_FAILED',
    },
  },
  LESSON_COMMENT: {
    NOT_OWNER: {
      status: HttpStatus.FORBIDDEN,
      message: 'You are not owner of this lesson comment',
      code: 'LESSON_COMMENT.NOT_OWNER',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson comment does not exist',
      code: 'LESSON_COMMENT.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Lesson comment not found',
      code: 'LESSON_COMMENT.NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store lesson comment',
      code: 'LESSON_COMMENT.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list lesson comment',
      code: 'LESSON_COMMENT.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail lesson comment',
      code: 'LESSON_COMMENT.GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update lesson comment',
      code: 'LESSON_COMMENT.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete lesson comment',
      code: 'LESSON_COMMENT.DELETE_FAILED',
    },
  },
  COURSE_STUDENT: {
    UNREGISTER_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to unregister course student',
      code: 'COURSE_STUDENT.UNREGISTER_FAILED',
    },
    CHECK_REGISTERED_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to check course student registered',
      code: 'COURSE_STUDENT.CHECK_REGISTERED_FAILED',
    },
    REGISTER_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to register course student',
      code: 'COURSE_STUDENT.REGISTER_FAILED',
    },
    NOT_REGISTERED: {
      status: HttpStatus.FORBIDDEN,
      message: 'Course student not registered',
      code: 'COURSE_STUDENT.NOT_REGISTERED',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course student already exist',
      code: 'COURSE_STUDENT.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course student does not exist',
      code: 'COURSE_STUDENT.DOES_NOT_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store course student',
      code: 'COURSE_STUDENT.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete course student',
      code: 'COURSE_STUDENT.BULK_DELETE_FAILED',
    },
  },
  ASSIGNMENT: {
    GET_MY_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get assignment my list',
      code: 'ASSIGNMENT.GET_MY_LIST_FAILED',
    },
    GET_STATISTIC_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get assignment statistic',
      code: 'ASSIGNMENT.GET_STATISTIC_FAILED',
    },
    GET_SUBMISSION_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get assignment submission',
      code: 'ASSIGNMENT.GET_SUBMISSION_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Assignment does not exist',
      code: 'ASSIGNMENT.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Assignment not found',
      code: 'ASSIGNMENT.NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store assignment',
      code: 'ASSIGNMENT.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list assignment',
      code: 'ASSIGNMENT.GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update assignment',
      code: 'ASSIGNMENT.UPDATE_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail assignment',
      code: 'ASSIGNMENT.GET_DETAIL_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete assignment',
      code: 'ASSIGNMENT.DELETE_FAILED',
    },
  },
  COURSE_ASSIGNMENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course assignment already exist',
      code: 'COURSE_ASSIGNMENT.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course assignment does not exist',
      code: 'COURSE_ASSIGNMENT.DOES_NOT_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store course assignment',
      code: 'COURSE_ASSIGNMENT.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete course assignment',
      code: 'COURSE_ASSIGNMENT.BULK_DELETE_FAILED',
    },
  },
  QUESTION_CATEGORY: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question category already exist',
      code: 'QUESTION_CATEGORY.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question category does not exist',
      code: 'QUESTION_CATEGORY.DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Question category not found',
      code: 'QUESTION_CATEGORY.NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store question category',
      code: 'QUESTION_CATEGORY.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question category',
      code: 'QUESTION_CATEGORY.GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail question category',
      code: 'QUESTION_CATEGORY.GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update question category',
      code: 'QUESTION_CATEGORY.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete question category',
      code: 'QUESTION_CATEGORY.DELETE_FAILED',
    },
  },
  SUBMIT_OPTION: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Submit option does not exist',
      code: 'SUBMIT_OPTION.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store submit option',
      code: 'SUBMIT_OPTION.STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update submit option',
      code: 'SUBMIT_OPTION.UPDATE_FAILED',
    },
  },
  MARK: {
    CALCULATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to calculate mark',
      code: 'MARK.CALCULATE_FAILED',
    },
  },
  ASSIGNMENT_ATTACHMENT: {
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store assignment attachment',
      code: 'ASSIGNMENT_ATTACHMENT.BULK_STORE_FAILED',
    },
  },
  EXERCISE_SUBMIT: {
    ALREADY_SUBMIT: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Already submit',
      code: 'EXERCISE_SUBMIT.ALREADY_SUBMIT',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Exercise submit already exist',
      code: 'EXERCISE_SUBMIT.ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise submit does not exist',
      code: 'EXERCISE_SUBMIT.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store exercise submit',
      code: 'EXERCISE_SUBMIT.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list exercise submit',
      code: 'EXERCISE_SUBMIT.GET_LIST_FAILED',
    },
  },
  EXERCISE_SUBMIT_OPTION: {
    INSERT_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store exercise submit option',
      code: 'EXERCISE_SUBMIT_OPTION.INSERT_FAILED',
    },
  },
  STUDENT_EXERCISE_GRADE: {
    BULK_CALCULATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk calculate student exercise grade',
      code: 'STUDENT_EXERCISE_GRADE.BULK_CALCULATE_FAILED',
    },
    NO_SUBMISSION: {
      status: HttpStatus.BAD_REQUEST,
      message: 'No submission',
      code: 'STUDENT_EXERCISE_GRADE.NO_SUBMISSION',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise submit grade does not exist',
      code: 'EXERCISE_SUBMIT_GRADE.DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Exercise submit grade already exist',
      code: 'EXERCISE_SUBMIT_GRADE.ALREADY_EXIST',
    },
    CALCULATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to calculate exercise submit grade',
      code: 'EXERCISE_SUBMIT_GRADE.CALCULATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete exercise submit grade',
      code: 'EXERCISE_SUBMIT_GRADE.DELETE_FAILED',
    },
  },
  EXERCISE_SUBMIT_MARK: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise submit mark does not exist',
      code: 'EXERCISE_SUBMIT_MARK.DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Exercise submit mark already exist',
      code: 'EXERCISE_SUBMIT_MARK.ALREADY_EXIST',
    },
    CALCULATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to calculate exercise submit mark',
      code: 'EXERCISE_SUBMIT_MARK.CALCULATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete exercise submit mark',
      code: 'EXERCISE_SUBMIT_MARK.DELETE_FAILED',
    },
  },
  ASSIGNMENT_EXERCISE: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Assignment exercise already exist',
      code: 'ASSIGNMENT_EXCERCISE.ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store assignment exercise',
      code: 'ASSIGNMENT_EXERCISE.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete assignment exercise',
      code: 'ASSIGNMENT_EXERCISE.BULK_DELETE_FAILED',
    },
  },
  CATEGORY: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Category already exist',
      code: 'CATEGORY.ALREADY_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Category not found',
      code: 'CATEGORY.NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Category does not exist',
      code: 'CATEGORY.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store category',
      code: 'CATEGORY.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list category',
      code: 'CATEGORY.GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update category',
      code: 'CATEGORY.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete category',
      code: 'CATEGORY.DELETE_FAILED',
    },
  },
  CATEGORY_COURSE: {
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete category course',
      code: 'CATEGORY_COURSE.DELETE_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Category course does not exist',
      code: 'CATEGORY_COURSE.DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Category course already exist',
      code: 'CATEGORY_COURSE.ALREADY_EXIST',
    },
  },
  ATTACHMENT: {
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail attachment',
      code: 'ATTACHMENT.GET_DETAIL_FAILED',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Attachment already exist',
      code: 'ATTACHMENT.ALREADY_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Attachment not found',
      code: 'ATTACHMENT.NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Attachment does not exist',
      code: 'ATTACHMENT.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store attachment',
      code: 'ATTACHMENT.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list attachment',
      code: 'ATTACHMENT.GET_LIST_FAILED',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store attachment',
      code: 'ATTACHMENT.BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete attachment',
      code: 'ATTACHMENT.BULK_DELETE_FAILED',
    },
  },
  IMAGE: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Image does not exist',
      code: 'IMAGE.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store image',
      code: 'IMAGE.STORE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete image',
      code: 'IMAGE.DELETE_FAILED',
    },
  },
  USER_IMAGE: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'User image does not exist',
      code: 'USER_IMAGE.DOES_NOT_EXIST',
    },
    UPSERT_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to upsert user image',
      code: 'USER_IMAGE.UPSERT_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete user image',
      code: 'USER_IMAGE.DELETE_FAILED',
    },
  },
  COURSE_IMAGE: {
    UPSERT_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to upsert course image',
      code: 'COURSE_IMAGE.UPSERT_FAILED',
    },
  },
  ASSIGNMENT_SUBMIT: {
    GET_GRADE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get assignment submit grade',
      code: 'ASSIGNMENT_SUBMIT.GET_GRADE_FAILED',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Assignment submit not found',
      code: 'ASSIGNMENT_SUBMIT.NOT_FOUND',
    },
    GET_STATISTIC_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get assignment submit statistic',
      code: 'ASSIGNMENT_SUBMIT.GET_STATISTIC_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete assignment submit',
      code: 'ASSIGNMENT_SUBMIT.DELETE_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Assignment submit does not exist',
      code: 'ASSIGNMENT_SUBMIT.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store assignment submit',
      code: 'ASSIGNMENT_SUBMIT.STORE_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail assignment submit',
      code: 'ASSIGNMENT_SUBMIT.GET_DETAIL_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list assignment submit',
      code: 'ASSIGNMENT_SUBMIT.GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update assignment submit',
      code: 'ASSIGNMENT_SUBMIT.UPDATE_FAILED',
    },
  },
  ASSIGNMENT_SUBMIT_GRADE: {
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete assignment submit grade',
      code: 'ASSIGNMENT_SUBMIT_GRADE.DELETE_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Assignment submit grade does not exist',
      code: 'ASSIGNMENT_SUBMIT_GRADE.DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Assignment submit grade already exist',
      code: 'ASSIGNMENT_SUBMIT_GRADE.ALREADY_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store assignment submit grade',
      code: 'ASSIGNMENT_SUBMIT_GRADE.STORE_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail assignment submit grade',
      code: 'ASSIGNMENT_SUBMIT_GRADE.GET_DETAIL_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list assignment submit grade',
      code: 'ASSIGNMENT_SUBMIT_GRADE.GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update assignment submit grade',
      code: 'ASSIGNMENT_SUBMIT_GRADE.UPDATE_FAILED',
    },
  },
  NOTIFICATION: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Notification does not exist',
      code: 'NOTIFICATION.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store notification',
      code: 'NOTIFICATION.STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list notification',
      code: 'NOTIFICATION.GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update notification',
      code: 'NOTIFICATION.UPDATE_FAILED',
    },
  },
  USER_NOTIFICATION: {
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete user notification',
      code: 'USER_NOTIFICATION.BULK_DELETE_FAILED',
    },
    BULK_UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk update user notification',
      code: 'USER_NOTIFICATION.BULK_UPDATE_FAILED',
    },
  },
  LEVEL: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Level does not exist',
      code: 'LEVEL.DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list level',
      code: 'LEVEL.GET_LIST_FAILED',
    },
  },
  STUDENT_EXERCISE: {
    NOT_SUBMITTED: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Student exercise not submitted',
      code: 'STUDENT_EXERCISE.NOT_SUBMITTED',
    },
    GET_SUBMITTED_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get submitted list student exercise',
      code: 'STUDENT_EXERCISE.GET_SUBMITTED_LIST_FAILED',
    },
    ALREADY_SUBMITTED: {
      status: HttpStatus.CONFLICT,
      message: 'Student exercise already submitted',
      code: 'STUDENT_EXERCISE.ALREADY_SUBMITTED',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Student exercise already exist',
      code: 'STUDENT_EXERCISE.ALREADY_EXIST',
    },
    SUBMIT_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to submit student exercise',
      code: 'STUDENT_EXERCISE.SUBMIT_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Student exercise does not exist',
      code: 'STUDENT_EXERCISE.DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store student exercise',
      code: 'STUDENT_EXERCISE.STORE_FAILED',
    },
    CANNOT_START_INACTIVE_EXERCISE: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Cannot start inactive exercise',
      code: 'STUDENT_EXERCISE.CANNOT_START_INACTIVE_EXERCISE',
    },
  },
  EXERCISE_QUESTION_SNAPSHOT: {
    STUDENT_GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list exercise question snapshot for student',
      code: 'EXERCISE_QUESTION_SNAPSHOT.STUDENT_GET_LIST_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise question snapshot does not exist',
      code: 'EXERCISE_QUESTION_SNAPSHOT.DOES_NOT_EXIST',
    },
  },
  EXERCISE_QUESTION_OPTION_SNAPSHOT: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise question option snapshot does not exist',
      code: 'EXERCISE_QUESTION_OPTION_SNAPSHOT.DOES_NOT_EXIST',
    },
  },
  COURSE_OUTCOME: {
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list course outcome',
      code: 'COURSE_OUTCOME.GET_LIST_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course outcome does not exist',
      code: 'COURSE_OUTCOME.DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course outcome already exist',
      code: 'COURSE_OUTCOME.ALREADY_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store course outcome',
      code: 'COURSE_OUTCOME.STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update course outcome',
      code: 'COURSE_OUTCOME.UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete course outcome',
      code: 'COURSE_OUTCOME.DELETE_FAILED',
    },
  },
};
