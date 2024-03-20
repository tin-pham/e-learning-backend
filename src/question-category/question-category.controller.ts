import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { QuestionCategoryService } from './question-category.service';
import {
  QuestionCategoryDeleteRO,
  QuestionCategoryGetListRO,
  QuestionCategoryStoreRO,
  QuestionCategoryUpdateRO,
} from './ro/question-category.ro';
import { QuestionCategoryGetListDTO, QuestionCategoryStoreDTO, QuestionCategoryUpdateDTO } from './dto/question-category.dto';
import { QuestionGetDetailRO } from '../question/ro/question.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE, DELETE } = API.QUESTION_CATEGORY;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class QuestionCategoryController {
  constructor(private readonly questionCategoryService: QuestionCategoryService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: QuestionCategoryStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: QuestionCategoryStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.questionCategoryService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: QuestionCategoryGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: QuestionCategoryGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.questionCategoryService.getList(dto, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: QuestionGetDetailRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  getDetail(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.questionCategoryService.getDetail(id, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: QuestionCategoryUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: QuestionCategoryUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.questionCategoryService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: QuestionCategoryDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.questionCategoryService.delete(id, decoded);
  }
}
