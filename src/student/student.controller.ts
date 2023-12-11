import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
  StudentGetDetailRO,
  StudentGetListRO,
  StudentStoreRO,
} from './ro/student.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE } = API.STUDENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: StudentStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() dto: StudentStoreDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
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
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.TEACHER))
  async getList(@Query() dto: UserGetListDTO) {
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
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.TEACHER))
  async getDetail(@Param('id') id: string) {
    return this.studentService.getDetail(id);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: StudentGetDetailRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Put(UPDATE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.TEACHER))
  async update(
    @Param('id') id: string,
    @Body() dto: StudentUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.studentService.update(id, dto, decoded);
  }
}
