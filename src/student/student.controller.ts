import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { USER_ROLE } from '../user-role/user-role.enum';
import { StudentService } from './student.service';
import { StudentStoreDTO, StudentUpdateDTO } from './dto/student.dto';
import { UserGetListDTO } from '../user/dto/user.dto';
import {
  StudentDeleteRO,
  StudentGetDetailRO,
  StudentGetListRO,
  StudentStoreRO,
  StudentUpdateRO,
} from './ro/student.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE, DELETE } =
  API.STUDENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: StudentStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR))
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: StudentStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: StudentGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @UseGuards(
    JwtGuard,
    RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR, USER_ROLE.TEACHER),
  )
  getList(@Query() dto: UserGetListDTO) {
    return this.studentService.getList(dto);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: StudentGetDetailRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @UseGuards(
    JwtGuard,
    RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR, USER_ROLE.TEACHER),
  )
  getDetail(@Param('id') id: string) {
    return this.studentService.getDetail(id);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: StudentUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR))
  update(
    @Param('id') id: string,
    @Body() dto: StudentUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.studentService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: StudentDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR))
  delete(@Param('id') id: string, @JwtPayload() decoded: IJwtPayload) {
    return this.studentService.delete(id, decoded);
  }
}
