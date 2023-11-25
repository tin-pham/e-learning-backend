import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { API, HttpExceptionRO } from '../common';
import { UserService } from './user.service';
import { UserStoreDTO } from './dto/user.dto';
import { UserStoreRO } from './ro/user.ro';

const { TAGS, CONTROLLER, STORE } = API.USER;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: UserStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @Post(STORE.ROUTE)
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() dto: UserStoreDTO) {
    return this.userService.store(dto);
  }
}
