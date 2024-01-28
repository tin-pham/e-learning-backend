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
import { ExerciseSubmitMarkService } from './exercise-submit-mark.service';
import { ExerciseSubmitMarkCalculateRO, ExerciseSubmitMarkDeleteRO } from './ro/exercise-submit-mark.ro';
import { ExerciseSubmitMarkCalculateDTO } from './dto/exercise-submit-mark.dto';

const { TAGS, CONTROLLER, CALCULATE, DELETE } = API.EXERCISE_SUBMIT_MARK;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ExerciseSubmitMarkController {
  constructor(private readonly exerciseSubmitMarkService: ExerciseSubmitMarkService) {}

  @ApiOperation({ summary: CALCULATE.OPERATION })
  @ApiCreatedResponse({ type: ExerciseSubmitMarkCalculateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(CALCULATE.ROUTE)
  @Roles(ROLE.ADMIN, ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  calculate(@Body() dto: ExerciseSubmitMarkCalculateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.exerciseSubmitMarkService.calculate(dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: ExerciseSubmitMarkDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.ADMIN, ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.exerciseSubmitMarkService.delete(id, decoded);
  }
}
