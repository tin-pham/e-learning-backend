import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
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
import { Roles } from '../auth/role/role.decorator';
import { JwtPayload } from '../common/decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { ExerciseSubmitService } from './exercise-submit.service';
import { ExerciseSubmitGetListDTO, ExerciseSubmitStoreDTO } from './dto/exercise-submit.dto';
import { ExerciseSubmitStoreRO } from '../exercise-submit/ro/exercise-submit.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST } = API.EXERCISE_SUBMIT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ExerciseSubmitController {
  constructor(private readonly exerciseSubmitService: ExerciseSubmitService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: ExerciseSubmitStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: ExerciseSubmitStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.exerciseSubmitService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: ExerciseSubmitStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard)
  getList(@Query() dto: ExerciseSubmitGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.exerciseSubmitService.getList(dto, decoded);
  }
}
