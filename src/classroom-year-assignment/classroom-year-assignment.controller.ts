import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/role.decorator';
import { JwtPayload } from '../common/decorator';
import { ClassroomYearAssignmentService } from './classroom-year-assignment.service';
import { ClassroomYearAssignmentBulkStoreDTO } from './dto/classroom-year-assignment.dto';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, BULK_STORE } = API.CLASSROOM_YEAR_ASSIGNMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ClassroomYearAssignmentController {
  constructor(
    private readonly classroomYearAssignmentService: ClassroomYearAssignmentService,
  ) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @Roles(ROLE.ADMIN, ROLE.STAFF)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkStore(
    @Body() dto: ClassroomYearAssignmentBulkStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.classroomYearAssignmentService.bulkStore(dto, decoded);
  }
}
