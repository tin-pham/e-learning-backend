import { Body, Controller, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/role/role.decorator';
import { JwtPayload } from '../common/decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { ExerciseSubmitOptionService } from './exercise-submit-option.service';
import { ExerciseSubmitOptionInsertRO } from './ro/exercise-submit-option.ro';
import { ExerciseSubmitOptionInsertDTO } from './dto/exercise-submit-option.dto';

const { TAGS, CONTROLLER, STORE } = API.EXERCISE_SUBMIT_OPTION;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ExerciseSubmitOptionController {
  constructor(private readonly exerciseSubmitOptionService: ExerciseSubmitOptionService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: ExerciseSubmitOptionInsertRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Put(STORE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: ExerciseSubmitOptionInsertDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.exerciseSubmitOptionService.store(dto, decoded);
  }
}
