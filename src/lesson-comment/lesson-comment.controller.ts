import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { LessonCommentService } from './lesson-comment.service';
import { LessonCommentGetListDTO, LessonCommentStoreDTO } from './dto/lesson-comment.dto';
import { LessonCommentGetListRO, LessonCommentStoreRO } from './ro/lesson-comment.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST } = API.LESSON_COMMENT;

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
  @Roles(ROLE.ADMIN)
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
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Body() dto: LessonCommentGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonCommentService.getList(dto, decoded);
  }
}
