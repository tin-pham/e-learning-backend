import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { LevelChooseDTO } from './dto/level.dto';
import { LevelChooseRO } from './ro/level.ro';
import { JwtPayload } from 'src/common/decorator';
import { LevelService } from './level.service';

const { TAGS, CONTROLLER, CHOOSE } = API.LEVEL;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @ApiOperation({ summary: CHOOSE.OPERATION })
  @ApiOkResponse({ type: LevelChooseRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(CHOOSE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  choose(@Body() dto: LevelChooseDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.levelService.choose(dto, decoded);
  }
}
