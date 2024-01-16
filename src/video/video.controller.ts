import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
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
import { VideoService } from './video.service';
import { ResultRO } from '../common/ro/result.ro';
import { VideoBulkDeleteDTO, VideoGetListDTO, VideoUploadDTO } from './dto/video.dto';
import { VideoGetListRO, VideoUploadRO } from './ro/video.ro';

const { TAGS, CONTROLLER, UPLOAD, BULK_DELETE, GET_LIST } = API.VIDEO;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiOperation({ summary: UPLOAD.OPERATION })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: VideoUploadRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @FormDataRequest()
  @Post(UPLOAD.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  upload(@Body() dto: VideoUploadDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.videoService.upload(dto, decoded);
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
  bulkDelete(@Body() dto: VideoBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.videoService.bulkDelete(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: VideoGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: VideoGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.videoService.getList(dto, decoded);
  }
}
