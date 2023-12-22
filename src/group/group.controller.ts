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
import { USER_ROLE } from '../user-role/user-role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { GroupService } from './group.service';
import {
  GroupGetListDTO,
  GroupStoreDTO,
  GroupUpdateDTO,
} from './dto/group.dto';
import {
  GroupDeleteRO,
  GroupGetListRO,
  GroupStoreRO,
  GroupUpdateRO,
} from './ro/group.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, UPDATE, DELETE } = API.GROUP;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: GroupStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: GroupStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.groupService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: GroupGetListRO })
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
  getList(@Query() dto: GroupGetListDTO, @JwtPayload() payload: IJwtPayload) {
    return this.groupService.getList(dto, payload);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: GroupUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: GroupUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.groupService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: GroupDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  delete(@Param('id') id: string, @JwtPayload() decoded: IJwtPayload) {
    return this.groupService.delete(id, decoded);
  }
}
