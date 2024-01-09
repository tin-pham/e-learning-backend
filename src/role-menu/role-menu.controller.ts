import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { RoleMenuService } from './role-menu.service';
import { RoleMenuBulkStoreDTO } from './dto/role-menu.dto';
import { ResultRO } from '../common/ro/result.ro';

const { TAGS, CONTROLLER, BULK_STORE } = API.ROLE_MENU;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class RoleMenuController {
  constructor(private readonly roleMenuService: RoleMenuService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkStore(@Body() dto: RoleMenuBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.roleMenuService.bulkStore(dto, decoded);
  }
}
