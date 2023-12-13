import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO } from '../common';
import { RoleGetListRO } from './ro/role.ro';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { USER_ROLE } from '../user-role/user-role.enum';
import { RoleService } from './role.service';

const { TAGS, CONTROLLER, GET_LIST } = API.ROLE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: RoleGetListRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  async getList() {
    return this.roleService.getList();
  }
}
