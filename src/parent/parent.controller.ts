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
import { ParentService } from './parent.service';
import { ParentStoreDTO, ParentUpdateDTO } from './dto/parent.dto';
import { UserGetListDTO } from '../user/dto/user.dto';
import {
  ParentDeleteRO,
  ParentGetDetailRO,
  ParentGetListRO,
  ParentStoreRO,
  ParentUpdateRO,
} from './ro/parent.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE, DELETE } =
  API.PARENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: ParentStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR))
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: ParentStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.parentService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: ParentGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.TEACHER))
  getList(@Query() dto: UserGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.parentService.getList(dto, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: ParentGetDetailRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.TEACHER))
  getDetail(@Param('id') id: string, @JwtPayload() decoded: IJwtPayload) {
    return this.parentService.getDetail(id, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: ParentUpdateRO })
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
    @Body() dto: ParentUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.parentService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: ParentDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR))
  delete(@Param('id') id: string, @JwtPayload() decoded: IJwtPayload) {
    return this.parentService.delete(id, decoded);
  }
}
