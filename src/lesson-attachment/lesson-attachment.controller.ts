import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
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
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { ResultRO } from '../common/ro/result.ro';
import { LessonAttachmentService } from './lesson-attachment.service';
import { LessonAttachmentBulkDeleteDTO, LessonAttachmentBulkStoreDTO, LessonAttachmentGetListDTO } from './dto/lesson-attachment.dto';
import { LessonAttachmentGetListRO } from './ro/lesson-attachment.ro';

const { TAGS, CONTROLLER, BULK_STORE, BULK_DELETE, GET_LIST } = API.LESSON_ATTACHMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class LessonAttachmentController {
  constructor(private readonly lessonAttachmentService: LessonAttachmentService) {}

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
  bulkStore(@Body() dto: LessonAttachmentBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonAttachmentService.bulkStore(dto, decoded);
  }

  @ApiOperation({ summary: BULK_DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(BULK_DELETE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  bulkDelete(@Query() dto: LessonAttachmentBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonAttachmentService.bulkDelete(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: LessonAttachmentGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: LessonAttachmentGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonAttachmentService.getList(dto, decoded);
  }
}
