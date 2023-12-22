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
import { JwtPayload } from '../common/decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { USER_ROLE } from '../user-role/user-role.enum';
import { SubjectGroupService } from './subject-group.service';
import { SubjectGroupBulkStoreDTO } from './dto/subject-group.dto';
import { ResultRO } from '../common/ro/result.ro';

const { CONTROLLER, TAGS, BULK_STORE } = API.SUBJECT_GROUP;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class SubjectGroupController {
  constructor(private readonly subjectGroupService: SubjectGroupService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  bulkStore(
    @Body() dto: SubjectGroupBulkStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.subjectGroupService.bulkStore(dto, decoded);
  }
}
