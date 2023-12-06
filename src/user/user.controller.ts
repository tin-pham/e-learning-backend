import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO } from '../common';
import { USER_ROLE } from './user-role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UserService } from './user.service';
import { UserStoreDTO } from './dto/user.dto';
import { UserStoreRO } from './ro/user.ro';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';
import { RoleGuard } from 'src/auth/role/role.guard';

const { TAGS, CONTROLLER, STORE, STORE_BY_API_KEY } = API.USER;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: UserStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() dto: UserStoreDTO) {
    return this.userService.store(dto);
  }

  @ApiOperation({ summary: STORE_BY_API_KEY.OPERATION })
  @ApiCreatedResponse({ type: UserStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiSecurity('api-key')
  @Post(STORE_BY_API_KEY.ROUTE)
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async storeByApiKey(@Body() dto: UserStoreDTO) {
    return this.userService.store(dto);
  }
}
