import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { JwtPayload } from '../common/decorator';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { MenuService } from './menu.service';
import { MenuGetListDTO } from './dto/menu.dto';
import { MenuGetListRO } from './ro/menu.ro';

const { TAGS, CONTROLLER, GET_LIST } = API.MENU;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: MenuGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @UseGuards(JwtGuard)
  getList(@Query() dto: MenuGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.menuService.getList(dto, decoded);
  }
}
