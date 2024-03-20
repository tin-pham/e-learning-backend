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
import { CourseService } from './course.service';
import { CourseGetDetailDTO, CourseGetListDTO, CourseStoreDTO, CourseTeacherGetListDTO, CourseUpdateDTO } from './dto/course.dto';
import { CourseDeleteRO, CourseGetDetailRO, CourseGetListRO, CourseStoreRO, CourseTeacherGetListRO, CourseUpdateRO } from './ro/course.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE, DELETE, TEACHER_GET_LIST } = API.COURSE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: CourseStoreRO })
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
  store(@Body() dto: CourseStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseService.store(dto, decoded);
  }

  @ApiOperation({ summary: TEACHER_GET_LIST.OPERATION })
  @ApiOkResponse({ type: CourseTeacherGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(TEACHER_GET_LIST.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  teacherGetList(@Query() dto: CourseTeacherGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseService.teacherGetList(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: CourseGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: CourseGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseService.getList(dto, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: CourseGetDetailRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getDetail(@Param('id', ParseIntPipe) id: number, @Query() dto: CourseGetDetailDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseService.getDetail(id, dto, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: CourseUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CourseUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: CourseDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.courseService.delete(id, decoded);
  }
}
