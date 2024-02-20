import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { UserService } from './user.service';
import { UserGetProfileRO, UserUpdateRO } from './ro/user.ro';
import { UserGetProfileDTO, UserUpdateDTO } from './dto/user.dto';

const { TAGS, CONTROLLER, GET_PROFILE, UPDATE } = API.USER;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: GET_PROFILE.OPERATION })
  @ApiOkResponse({ type: UserGetProfileRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_PROFILE.ROUTE)
  @Roles(ROLE.STUDENT, ROLE.ADMIN, ROLE.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  getProfile(@Query() dto: UserGetProfileDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.userService.getProfile(dto, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: UserUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.ADMIN, ROLE.STAFF)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Body() dto: UserUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.userService.updateProfile(dto, decoded);
  }
}
