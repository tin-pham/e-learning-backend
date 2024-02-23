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
import { AttachmentService } from './attachment.service';
import { AttachmentBulkDeleteDTO, AttachmentBulkStoreDTO, AttachmentGetListDTO, AttachmentStoreDTO } from './dto/attachment.dto';
import { AttachmentGetListRO, AttachmentStoreRO } from './ro/attachment.ro';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, STORE, BULK_STORE, BULK_DELETE, GET_LIST } = API.ATTACHMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: AttachmentStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: AttachmentStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.store(dto, decoded);
  }

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
  bulkStore(@Body() dto: AttachmentBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.bulkStore(dto, decoded);
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
  bulkDelete(@Query() dto: AttachmentBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.bulkDelete(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: AttachmentGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: AttachmentGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.getList(dto, decoded);
  }
}
