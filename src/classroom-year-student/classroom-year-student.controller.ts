import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ClassroomYearStudentService } from './classroom-year-student.service';
import { ClassroomYearStudentBulkStoreDTO } from './dto/classroom-year-student.dto';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, BULK_STORE } = API.CLASSROOM_YEAR_STUDENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ClassroomYearStudentController {
  constructor(
    private readonly classroomYearStudentService: ClassroomYearStudentService,
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
    @Body() dto: ClassroomYearStudentBulkStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.classroomYearStudentService.bulkStore(dto, decoded);
  }
}
