import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { JwtPayload } from '../common/decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ResultRO } from '../common/ro/result.ro';
import { PostAttachmentService } from './post-attachment.service';
import { PostAttachmentBulkDeleteDTO, PostAttachmentBulkStoreDTO } from './dto/post-attachment.dto';

const { TAGS, CONTROLLER, BULK_STORE, BULK_DELETE } = API.POST_ATTACHMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class PostAttachmentController {
  constructor(private readonly postAttachmentService: PostAttachmentService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkUpload(@Body() dto: PostAttachmentBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.postAttachmentService.bulkStore(dto, decoded);
  }

  @ApiOperation({ summary: BULK_DELETE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(BULK_DELETE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkDelete(@Query() dto: PostAttachmentBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.postAttachmentService.bulkDelete(dto, decoded);
  }
}
