import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { RoleService } from './role.service';
import { RoleGetListRO } from './ro/role.ro';

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
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async getList() {
    return this.roleService.getList();
  }
}
