import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { AssignmentSubmitGradeService } from './assignment-submit-grade.service';
import { AssignmentSubmitGradeStoreRO } from './ro/assignment-submit-grade.ro';
import { AssignmentSubmitGradeStoreDTO } from './dto/assignment-submit-grade.dto';

const { TAGS, CONTROLLER, STORE } = API.ASSIGNMENT_SUBMIT_GRADE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AssignmentSubmitGradeController {
  constructor(private readonly assignmentSubmitGradeService: AssignmentSubmitGradeService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: AssignmentSubmitGradeStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: AssignmentSubmitGradeStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.assignmentSubmitGradeService.store(dto, decoded);
  }
}
