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
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update year',
      code: 'YEAR_UPDATE_FAILED',
    },
  },
  LEVEL: {
    CHOOSE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to choose level',
      code: 'LEVEL_CHOOSE_FAILED',
    },
  },
  CLASSROOM_YEAR: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Classroom year does not exist',
      code: 'CLASSROOM_YEAR_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Classroom year not found',
      code: 'CLASSROOM_YEAR_NOT_FOUND',
    },
    FORM_TEACHER_ALREADY_ASSIGNED: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Form teacher already assigned',
      code: 'CLASSROOM_YEAR_FORM_TEACHER_ALREADY_ASSIGNED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update classroom year',
      code: 'CLASSROOM_YEAR_UPDATE_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail classroom year',
      code: 'CLASSROOM_YEAR_GET_DETAIL_FAILED',
    },
  },
  CLASSROOM_YEAR_STUDENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Classroom year student already exist',
      code: 'CLASSROOM_YEAR_STUDENT_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store classroom year student',
      code: 'CLASSROOM_YEAR_STUDENT_BULK_STORE_FAILED',
    },
  },
  TEACHER_SUBJECT: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Teacher subject does not exist',
      code: 'TEACHER_SUBJECT_DOES_NOT_EXIST',
    },
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Teacher subject already exist',
      code: 'TEACHER_SUBJECT_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store teacher subject',
      code: 'TEACHER_SUBJECT_BULK_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list teacher subject',
      code: 'TEACHER_SUBJECT_GET_LIST_FAILED',
    },
  },
  CLASSROOM_YEAR_ASSIGNMENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Classroom year assignment already exist',
      code: 'CLASSROOM_YEAR_ASSIGNMENT_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store classroom year assignment',
      code: 'CLASSROOM_YEAR_ASSIGNMENT_BULK_STORE_FAILED',
    },
  },
  S3: {
    UPLOAD_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload file',
      code: 'S3_UPLOAD_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete file',
      code: 'S3_DELETE_FAILED',
    },
  },
  MENU: {
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list menu',
      code: 'MENU_GET_LIST_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Menu does not exist',
      code: 'MENU_DOES_NOT_EXIST',
    },
  },
  ROLE_MENU: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Role menu already exist',
      code: 'ROLE_MENU_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store role menu',
      code: 'ROLE_MENU_BULK_STORE_FAILED',
    },
  },
  COURSE: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course already exist',
      code: 'COURSE_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course does not exist',
      code: 'COURSE_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Course not found',
      code: 'COURSE_NOT_FOUND',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list course',
      code: 'COURSE_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail course',
      code: 'COURSE_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store course',
      code: 'COURSE_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update course',
      code: 'COURSE_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete course',
      code: 'COURSE_DELETE_FAILED',
    },
  },
  SECTION: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Section already exist',
      code: 'SECTION_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Section does not exist',
      code: 'SECTION_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Section not found',
      code: 'SECTION_NOT_FOUND',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list section',
      code: 'SECTION_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail section',
      code: 'SECTION_GET_DETAIL_FAILED',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store section',
      code: 'SECTION_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update section',
      code: 'SECTION_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete section',
      code: 'SECTION_DELETE_FAILED',
    },
  },
  ANSWER: {
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store answer',
      code: 'ANSWER_STORE_FAILED',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Answer not found',
      code: 'ANSWER_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Answer does not exist',
      code: 'ANSWER_DOES_NOT_EXIST',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail answer',
      code: 'ANSWER_GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update answer',
      code: 'ANSWER_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete answer',
      code: 'ANSWER_DELETE_FAILED',
    },
  },
  QUESTION: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question does not exist',
      code: 'QUESTION_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Question not found',
      code: 'QUESTION_NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store question',
      code: 'QUESTION_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question',
      code: 'QUESTION_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail question',
      code: 'QUESTION_GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update question',
      code: 'QUESTION_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete question',
      code: 'QUESTION_DELETE_FAILED',
    },
  },
  QUESTION_OPTION: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question option already exist',
      code: 'QUESTION_OPTION_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question option does not exist',
      code: 'QUESTION_OPTION_DOES_NOT_EXIST',
    },
    DOES_NOT_BELONG_TO_QUESTION: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question option does not belong to question',
      code: 'QUESTION_OPTION_DOES_NOT_BELONG_TO_QUESTION',
    },
    IS_CORRECT_ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question option is correct already exist',
      code: 'QUESTION_OPTION_IS_CORRECT_ALREADY_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Question option not found',
      code: 'QUESTION_OPTION_NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store question option',
      code: 'QUESTION_OPTION_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question option',
      code: 'QUESTION_OPTION_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail question option',
      code: 'QUESTION_OPTION_GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update question option',
      code: 'QUESTION_OPTION_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete question option',
      code: 'QUESTION_OPTION_DELETE_FAILED',
    },
  },
  DIFFICULTY: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Difficulty does not exist',
      code: 'DIFFICULTY_DOES_NOT_EXIST',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list difficulty',
      code: 'DIFFICULTY_GET_LIST_FAILED',
    },
  },
  FILE: {
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store file',
      code: 'FILE_STORE_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'File does not exist',
      code: 'FILE_DOES_NOT_EXIST',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete file',
      code: 'FILE_DELETE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list file',
      code: 'FILE_GET_LIST_FAILED',
    },
  },
  LESSON: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson does not exist',
      code: 'LESSON_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Lesson not found',
      code: 'LESSON_NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store lesson',
      code: 'LESSON_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list lesson',
      code: 'LESSON_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail lesson',
      code: 'LESSON_GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update lesson',
      code: 'LESSON_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete lesson',
      code: 'LESSON_DELETE_FAILED',
    },
  },
  LESSON_FILE: {
    ALREADY_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson file already exist',
      code: 'LESSON_FILE_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store lesson file',
      code: 'LESSON_FILE_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete lesson file',
      code: 'LESSON_FILE_BULK_DELETE_FAILED',
    },
  },
  ATTACHMENT: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Video does not exist',
      code: 'ATTACHMENT_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Video not found',
      code: 'ATTACHMENT_NOT_FOUND',
    },
    UPLOAD_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload video',
      code: 'ATTACHMENT_UPLOAD_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete video',
      code: 'ATTACHMENT_BULK_DELETE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list video',
      code: 'ATTACHMENT_GET_LIST_FAILED',
    },
  },
  LESSON_ATTACHMENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Lesson attachment already exist',
      code: 'LESSON_ATTACHMENT_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson attachment does not exist',
      code: 'LESSON_ATTACHMENT_DOES_NOT_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store lesson attachment',
      code: 'LESSON_ATTACHMENT_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete lesson attachment',
      code: 'LESSON_ATTACHMENT_BULK_DELETE_FAILED',
    },
  },
  EXERCISE: {
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store exercise',
      code: 'EXERCISE_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list exercise',
      code: 'EXERCISE_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail exercise',
      code: 'EXERCISE_GET_DETAIL_FAILED',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Exercise not found',
      code: 'EXERCISE_NOT_FOUND',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update exercise',
      code: 'EXERCISE_UPDATE_FAILED',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Exercise does not exist',
      code: 'EXERCISE_DOES_NOT_EXIST',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete exercise',
      code: 'EXERCISE_DELETE_FAILED',
    },
  },
  EXERCISE_QUESTION: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Exercise question already exist',
      code: 'EXERCISE_QUESTION_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store exercise question',
      code: 'EXERCISE_QUESTION_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete exercise question',
      code: 'EXERCISE_QUESTION_BULK_DELETE_FAILED',
    },
  },
  LESSON_COMMENT: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Lesson comment does not exist',
      code: 'LESSON_COMMENT_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Lesson comment not found',
      code: 'LESSON_COMMENT_NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store lesson comment',
      code: 'LESSON_COMMENT_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list lesson comment',
      code: 'LESSON_COMMENT_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail lesson comment',
      code: 'LESSON_COMMENT_GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update lesson comment',
      code: 'LESSON_COMMENT_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete lesson comment',
      code: 'LESSON_COMMENT_DELETE_FAILED',
    },
  },
  VIDEO: {
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Video not found',
      code: 'VIDEO_NOT_FOUND',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Video does not exist',
      code: 'VIDEO_DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store video',
      code: 'VIDEO_STORE_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail video',
      code: 'VIDEO_GET_DETAIL_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete video',
      code: 'VIDEO_DELETE_FAILED',
    },
  },
  DIRECTORY: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Directory already exist',
      code: 'DIRECTORY_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Directory does not exist',
      code: 'DIRECTORY_DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store directory',
      code: 'DIRECTORY_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list directory',
      code: 'DIRECTORY_GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update directory',
      code: 'DIRECTORY_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete directory',
      code: 'DIRECTORY_DELETE_FAILED',
    },
  },
  COURSE_STUDENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course student already exist',
      code: 'COURSE_STUDENT_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course student does not exist',
      code: 'COURSE_STUDENT_DOES_NOT_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store course student',
      code: 'COURSE_STUDENT_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete course student',
      code: 'COURSE_STUDENT_BULK_DELETE_FAILED',
    },
  },
  ASSIGNMENT: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Assignment does not exist',
      code: 'ASSIGNMENT_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Assignment not found',
      code: 'ASSIGNMENT_NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store assignment',
      code: 'ASSIGNMENT_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list assignment',
      code: 'ASSIGNMENT_GET_LIST_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update assignment',
      code: 'ASSIGNMENT_UPDATE_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail assignment',
      code: 'ASSIGNMENT_GET_DETAIL_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete assignment',
      code: 'ASSIGNMENT_DELETE_FAILED',
    },
  },
  COURSE_ASSIGNMENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Course assignment already exist',
      code: 'COURSE_ASSIGNMENT_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Course assignment does not exist',
      code: 'COURSE_ASSIGNMENT_DOES_NOT_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store course assignment',
      code: 'COURSE_ASSIGNMENT_BULK_STORE_FAILED',
    },
    BULK_DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk delete course assignment',
      code: 'COURSE_ASSIGNMENT_BULK_DELETE_FAILED',
    },
  },
  QUESTION_CATEGORY: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Question category already exist',
      code: 'QUESTION_CATEGORY_ALREADY_EXIST',
    },
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Question category does not exist',
      code: 'QUESTION_CATEGORY_DOES_NOT_EXIST',
    },
    NOT_FOUND: {
      status: HttpStatus.NOT_FOUND,
      message: 'Question category not found',
      code: 'QUESTION_CATEGORY_NOT_FOUND',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store question category',
      code: 'QUESTION_CATEGORY_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list question category',
      code: 'QUESTION_CATEGORY_GET_LIST_FAILED',
    },
    GET_DETAIL_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get detail question category',
      code: 'QUESTION_CATEGORY_GET_DETAIL_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update question category',
      code: 'QUESTION_CATEGORY_UPDATE_FAILED',
    },
    DELETE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete question category',
      code: 'QUESTION_CATEGORY_DELETE_FAILED',
    },
  },
  SUBMIT: {
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store submit',
      code: 'SUBMIT_STORE_FAILED',
    },
    GET_LIST_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to get list submit',
      code: 'SUBMIT_GET_LIST_FAILED',
    },
  },
  SUBMIT_OPTION: {
    DOES_NOT_EXIST: {
      status: HttpStatus.BAD_REQUEST,
      message: 'Submit option does not exist',
      code: 'SUBMIT_OPTION_DOES_NOT_EXIST',
    },
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store submit option',
      code: 'SUBMIT_OPTION_STORE_FAILED',
    },
    UPDATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to update submit option',
      code: 'SUBMIT_OPTION_UPDATE_FAILED',
    },
  },
  MARK: {
    CALCULATE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to calculate mark',
      code: 'MARK_CALCULATE_FAILED',
    },
  },
  ASSIGNMENT_ATTACHMENT: {
    ALREADY_EXIST: {
      status: HttpStatus.CONFLICT,
      message: 'Assignment attachment already exist',
      code: 'ASSIGNMENT_ATTACHMENT_ALREADY_EXIST',
    },
    BULK_STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to bulk store assignment attachment',
      code: 'ASSIGNMENT_ATTACHMENT_BULK_STORE_FAILED',
    },
  },
  EXERCISE_SUBMIT: {
    STORE_FAILED: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to store exercise submit',
      code: 'EXERCISE_SUBMIT_STORE_FAILED',
    },
  },
};
