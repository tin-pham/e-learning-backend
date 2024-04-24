import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { StudentExerciseGradeService } from './student-exercise-grade.service';
import { StudentExerciseGradeCalculateRO, StudentExerciseGradeDeleteRO } from './ro/student-exercise-grade.ro';
import {
  StudentExerciseGradeBulkCalculateDTO,
  StudentExerciseGradeCalculateDTO,
  StudentExerciseGradeDeleteAllDTO,
} from './dto/student-exercise-grade.dto';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, CALCULATE, DELETE, BULK_CALCULATE, DELETE_ALL } = API.STUDENT_EXERCISE_GRADE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class StudentExerciseGradeController {
  constructor(private readonly studentExerciseGradeService: StudentExerciseGradeService) {}

  @ApiOperation({ summary: CALCULATE.OPERATION })
  @ApiCreatedResponse({ type: StudentExerciseGradeCalculateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(CALCULATE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  calculate(@Body() dto: StudentExerciseGradeCalculateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseGradeService.calculate(dto, decoded);
  }

  @ApiOperation({ summary: BULK_CALCULATE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_CALCULATE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkCalculate(@Body() dto: StudentExerciseGradeBulkCalculateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseGradeService.bulkCalculate(dto, decoded);
  }

  @ApiOperation({ summary: DELETE_ALL.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(DELETE_ALL.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  deleteAll(@Body() dto: StudentExerciseGradeDeleteAllDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseGradeService.deleteAll(dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: StudentExerciseGradeDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseGradeService.delete(id, decoded);
  }
}
