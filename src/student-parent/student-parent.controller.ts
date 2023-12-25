import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { StudentParentService } from './student-parent.service';
import {
  StudentParentBulkDeleteDTO,
  StudentParentBulkStoreDTO,
} from './dto/student-parent.dto';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, BULK_STORE, BULK_DELETE } = API.STUDENT_PARENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class StudentParentController {
  constructor(private readonly studentParentService: StudentParentService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN, ROLE.MODERATOR))
  @HttpCode(HttpStatus.CREATED)
  bulkStore(
    @Body() dto: StudentParentBulkStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.studentParentService.bulkStore(dto, decoded);
  }

  @ApiOperation({ summary: BULK_DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(BULK_DELETE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN))
  bulkDelele(
    @Query() dto: StudentParentBulkDeleteDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.studentParentService.bulkDelete(dto, decoded);
  }
}
