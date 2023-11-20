import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API } from '../common';
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
  @Post(STORE.ROUTE)
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() dto: UserStoreDTO) {
    return this.userService.store(dto);
  }
}
