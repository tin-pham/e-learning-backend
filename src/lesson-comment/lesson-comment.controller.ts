import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { LessonCommentService } from './lesson-comment.service';
import { LessonCommentGetListDTO, LessonCommentStoreDTO, LessonCommentUpdateDTO } from './dto/lesson-comment.dto';
import {
  LessonCommentDeleteRO,
  LessonCommentGetDetailRO,
  LessonCommentGetListRO,
  LessonCommentStoreRO,
  LessonCommentUpdateRO,
} from './ro/lesson-comment.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE, DELETE } = API.LESSON_COMMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class LessonCommentController {
  constructor(private readonly lessonCommentService: LessonCommentService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: LessonCommentStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: LessonCommentStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonCommentService.store(dto, decoded);
  }

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiOkResponse({ type: LessonCommentGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: LessonCommentGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonCommentService.getList(dto, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: LessonCommentGetDetailRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getDetail(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonCommentService.getDetail(id, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: LessonCommentUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: LessonCommentUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonCommentService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: LessonCommentDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonCommentService.delete(id, decoded);
  }
}
