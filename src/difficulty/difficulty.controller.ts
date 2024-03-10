import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { DifficultyService } from './difficulty.service';
import { DifficultyGetListRO } from './ro/difficulty.ro';

const { TAGS, CONTROLLER, GET_LIST } = API.DIFFICULTY;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class DifficultyController {
  constructor(private readonly difficultyService: DifficultyService) {}

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: DifficultyGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@JwtPayload() decoded: IJwtPayload) {
    return this.difficultyService.getList(decoded);
  }
}
