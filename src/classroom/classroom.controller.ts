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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import {
  ClassroomGetListDTO,
  ClassroomStoreDTO,
  ClassroomUpdateDTO,
} from './dto/classroom.dto';
import {
  ClassroomDeleteRO,
  ClassroomStoreRO,
  ClassroomUpdateRO,
} from './ro/classroom.ro';
import { ClassroomService } from './classroom.service';

const { TAGS, CONTROLLER, STORE, GET_LIST, UPDATE, DELETE } = API.CLASSROOM;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: ClassroomStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: ClassroomStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.classroomService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: ClassroomStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN, ROLE.MODERATOR, ROLE.TEACHER))
  getList(
    @Query() dto: ClassroomGetListDTO,
    @JwtPayload() payload: IJwtPayload,
  ) {
    return this.classroomService.getList(dto, payload);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: ClassroomUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: ClassroomUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.classroomService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: ClassroomDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(ROLE.ADMIN))
  delete(@Param('id') id: string, @JwtPayload() decoded: IJwtPayload) {
    return this.classroomService.delete(id, decoded);
  }
}
