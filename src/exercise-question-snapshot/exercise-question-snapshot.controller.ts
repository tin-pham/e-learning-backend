import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { ExerciseQuestionSnapshotService } from './exercise-question-snapshot.service';
import { ExerciseQuestionSnapshotGetListDTO } from './dto/exercise-question-snapshot.dto';
import { ExerciseQuestionSnapshotGetListRO } from './ro/exercise-question-snapshot.ro';

const { TAGS, CONTROLLER, STUDENT_GET_LIST } = API.EXERCISE_QUESTION_SNAPSHOT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ExerciseQuestionSnapshotController {
  constructor(private readonly exerciseQuestionSnapshotService: ExerciseQuestionSnapshotService) {}

  @ApiOperation({ summary: STUDENT_GET_LIST.OPERATION })
  @ApiOkResponse({ type: ExerciseQuestionSnapshotGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(STUDENT_GET_LIST.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  studentGetList(@Query() dto: ExerciseQuestionSnapshotGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.exerciseQuestionSnapshotService.studentGetList(dto, decoded);
  }
}
