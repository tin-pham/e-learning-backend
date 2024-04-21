import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
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
import { UserNotificationService } from './user-notification.service';
import { ResultRO } from '../common/ro/result.ro';
import { UserNotificationBulkDeleteDTO, UserNotificationBulkUpdateDTO } from './dto/user-notification.dto';

const { TAGS, CONTROLLER, BULK_UPDATE, BULK_DELETE, READ_ALL } = API.USER_NOTIFICATION;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class UserNotificationController {
  constructor(private readonly userNotificationService: UserNotificationService) {}

  @ApiOperation({ summary: READ_ALL.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(READ_ALL.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  readAll(@JwtPayload() decoded: IJwtPayload) {
    return this.userNotificationService.readAll(decoded);
  }

  @ApiOperation({ summary: BULK_UPDATE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_UPDATE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  bulkUpdate(@Body() dto: UserNotificationBulkUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.userNotificationService.bulkUpdate(dto, decoded);
  }

  @ApiOperation({ summary: BULK_DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(BULK_DELETE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkDelete(@Query() dto: UserNotificationBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.userNotificationService.bulkDelete(dto, decoded);
  }
}
