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
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { TeacherSubjectService } from './teacher-subject.service';
import { TeacherSubjectBulkStoreDTO } from './dto/teacher-subject.dto';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, BULK_STORE } = API.TEACHER_SUBJECT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class TeacherSubjectController {
  constructor(private readonly subjectGroupService: TeacherSubjectService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkStore(
    @Body() dto: TeacherSubjectBulkStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.subjectGroupService.bulkStore(dto, decoded);
  }
}
