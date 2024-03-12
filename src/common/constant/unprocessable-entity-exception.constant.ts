export const UNPROCESSABLE_ENTITY_EXCEPTION = {
  MIME: {
    FORMAT_IS_NOT_VALID: 'MIME.FORMAT_IS_NOT_VALID',
  },
  CATEGORY: {
    NAME: {
      FORMAT_IS_NOT_VALID: 'CATEGORY.NAME.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'CATEGORY.NAME.IS_NOT_EMPTY',
    },
    DESCRIPTION: {
      FORMAT_IS_NOT_VALID: 'CATEGORY.DESCRIPTION.FORMAT_IS_NOT_VALID',
    },
  },
  COURSE: {
    NAME: {
      FORMAT_IS_NOT_VALID: 'COURSE.NAME.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'COURSE.NAME.IS_NOT_EMPTY',
    },
    DESCRIPTION: {
      FORMAT_IS_NOT_VALID: 'COURSE.DESCRIPTION.FORMAT_IS_NOT_VALID',
    },
    CATEGORY_ID: {
      FORMAT_IS_NOT_VALID: 'COURSE.CATEGORY_ID.FORMAT_IS_NOT_VALID',
    },
    STUDENT_ID: {
      FORMAT_IS_NOT_VALID: 'COURSE.STUDENT_ID.FORMAT_IS_NOT_VALID',
    },
  },
  SECTION: {
    NAME: {
      FORMAT_IS_NOT_VALID: 'SECTION.NAME.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'SECTION.NAME.IS_NOT_EMPTY',
    },
    COURSE_ID: {
      FORMAT_IS_NOT_VALID: 'SECTION.COURSE_ID.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'SECTION.COURSE_ID.IS_NOT_EMPTY',
    },
  },
  LESSON: {
    TITLE: {
      FORMAT_IS_NOT_VALID: 'LESSON.TITLE.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'LESSON.TITLE.IS_NOT_EMPTY',
    },
    BODY: {
      FORMAT_IS_NOT_VALID: 'LESSON.BODY.FORMAT_IS_NOT_VALID',
    },
    SECTION_ID: {
      FORMAT_IS_NOT_VALID: 'LESSON.SECTION_ID.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'LESSON.SECTION_ID.IS_NOT_EMPTY',
    },
    VIDEO_URL: {
      FORMAT_IS_NOT_VALID: 'LESSON.VIDEO_URL.FORMAT_IS_NOT_VALID',
    },
  },
  ASSIGNMENT: {
    NAME: {
      FORMAT_IS_NOT_VALID: 'ASSIGNMENT.NAME.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'ASSIGNMENT.NAME.IS_NOT_EMPTY',
    },
    DESCRIPTION: {
      FORMAT_IS_NOT_VALID: 'ASSIGNMENT.DESCRIPTION.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'ASSIGNMENT.DESCRIPTION.IS_NOT_EMPTY',
    },
    DUE_DATE: {
      FORMAT_IS_NOT_VALID: 'ASSIGNMENT.DUE_DATE.FORMAT_IS_NOT_VALID',
      IS_NOT_EMPTY: 'ASSIGNMENT.DUE_DATE.IS_NOT_EMPTY',
    },
    LESSON_ID: {
      FORMAT_IS_NOT_VALID: 'ASSIGNMENT.LESSON_ID.FORMAT_IS_NOT_VALID',
    },
  },
  ASSIGNMENT_SUBMIT_GRADE: {
    GRADE: {
      IS_NOT_EMPTY: 'ASSIGNMENT_SUBMIT_GRADE.GRADE.IS_NOT_EMPTY',
      MAX_IS_100: 'ASSIGNMENT_SUBMIT_GRADE.GRADE.MAX_IS_100',
      MIN_IS_0: 'ASSIGNMENT_SUBMIT_GRADE.GRADE.MIN_IS_0',
    },
  },
  EXERCISE: {
    NAME: {
      IS_NOT_EMPTY: 'EXERCISE.NAME.IS_NOT_EMPTY',
    },
    DIFFICULTY_ID: {
      IS_NOT_EMPTY: 'EXERCISE.DIFFICULTY_ID.IS_NOT_EMPTY',
    },
    LESSON_ID: {
      IS_NOT_EMPTY: 'EXERCISE.LESSON_ID.IS_NOT_EMPTY',
    },
  },
  QUESTION: {
    TEXT: {
      IS_NOT_EMPTY: 'QUESTION.TEXT.IS_NOT_EMPTY',
    },
    DIFFICULTY_ID: {
      IS_NOT_EMPTY: 'QUESTION.DIFFICULTY_ID.IS_NOT_EMPTY',
    },
  },
  QUESTION_CATEGORY: {
    NAME: {
      IS_NOT_EMPTY: 'QUESTION_CATEGORY.NAME.IS_NOT_EMPTY',
    },
  },
};
