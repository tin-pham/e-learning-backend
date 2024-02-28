import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
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
import { CourseStudentService } from './course-student.service';
import { ResultRO } from '../common/ro/result.ro';
import {
  CourseStudentBulkDeleteDTO,
  CourseStudentBulkStoreDTO,
  CourseStudentCheckRegisteredDTO,
  CourseStudentIsRegisteredDTO,
  CourseStudentRegisterDTO,
  CourseStudentUnRegisterDTO,
} from './dto/course-student.dto';
import { CourseStudentRegisterRO } from './ro/course-student.ro';

const { TAGS, CONTROLLER, BULK_STORE, BULK_DELETE, CHECK_REGISTERED, REGISTER, IS_REGISTERED, UN_REGISTER } = API.COURSE_STUDENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class CourseStudentController {
  constructor(private readonly courseStudentService: CourseStudentService) {}

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
  bulkStore(@Body() dto: CourseStudentBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseStudentService.bulkStore(dto, decoded);
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
  bulkDelete(@Query() dto: CourseStudentBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseStudentService.bulkDelete(dto, decoded);
  }

  @ApiOperation({ summary: CHECK_REGISTERED.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(CHECK_REGISTERED.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  checkRegistered(@Body() dto: CourseStudentCheckRegisteredDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseStudentService.checkRegistered(dto, decoded);
  }

  @ApiOperation({ summary: REGISTER.OPERATION })
  @ApiCreatedResponse({ type: CourseStudentRegisterRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(REGISTER.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  register(@Body() dto: CourseStudentRegisterDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseStudentService.register(dto, decoded);
  }

  @ApiOperation({ summary: IS_REGISTERED.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(IS_REGISTERED.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  isRegister(@Body() dto: CourseStudentIsRegisteredDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseStudentService.isRegistered(dto, decoded);
  }

  @ApiOperation({ summary: UN_REGISTER.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(UN_REGISTER.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  unRegister(@Body() dto: CourseStudentUnRegisterDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseStudentService.unregister(dto, decoded);
  }
}
