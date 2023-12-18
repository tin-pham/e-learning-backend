import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { GroupStoreDTO, GroupUpdateDTO } from './dto/group.dto';
import { GroupGetListRO, GroupStoreRO, GroupUpdateRO } from './ro/group.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, UPDATE } = API.GROUP;

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
  getList() {
    return this.groupService.getList();
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
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR))
  update(
    @Param('id') id: string,
    @Body() dto: GroupUpdateDTO,
    @JwtPayload() payload: IJwtPayload,
  ) {
    return this.groupService.update(id, dto, payload);
  }
}
