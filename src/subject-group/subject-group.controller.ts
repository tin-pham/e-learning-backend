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
import { SubjectGroupService } from './subject-group.service';
import {
  SubjectGroupBulkDeleteDTO,
  SubjectGroupBulkStoreDTO,
} from './dto/subject-group.dto';
import { ResultRO } from '../common/ro/result.ro';

const { CONTROLLER, TAGS, BULK_STORE, BULK_DELETE } = API.SUBJECT_GROUP;

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
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  bulkStore(
    @Body() dto: SubjectGroupBulkStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.subjectGroupService.bulkStore(dto, decoded);
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
  bulkDelete(
    @Query() dto: SubjectGroupBulkDeleteDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    console.log(dto);
    return this.subjectGroupService.bulkDelete(dto, decoded);
  }
}
