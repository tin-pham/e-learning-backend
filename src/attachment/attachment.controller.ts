import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { JwtPayload } from '../common/decorator';
import { LocalFilesInterceptor } from '../common/interceptor/local-file.interceptor';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ResultRO } from '../common/ro/result.ro';
import { AttachmentService } from './attachment.service';
import { AttachmentBulkDeleteDTO, AttachmentGetListDTO } from './dto/attachment.dto';
import { AttachmentGetListRO, AttachmentUploadRO } from './ro/attachment.ro';

const { TAGS, CONTROLLER, UPLOAD, BULK_DELETE, GET_LIST, GET_DETAIL } = API.ATTACHMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @ApiOperation({ summary: UPLOAD.OPERATION })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: AttachmentUploadRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'attachment',
      path: '/attachments',
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.includes('attachment')) {
          return callback(new BadRequestException('Provide a valid attachment'), false);
        }
        callback(null, true);
      },
    }),
  )
  @Post(UPLOAD.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  upload(@UploadedFile() file: Express.Multer.File, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.upload(file, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: StreamableFile })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  getDetail(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.getDetail(id, decoded);
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
  bulkDelete(@Body() dto: AttachmentBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
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
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: AttachmentGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.attachmentService.getList(dto, decoded);
  }
}
