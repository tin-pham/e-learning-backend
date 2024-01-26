import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
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
import { SubmitOptionService } from './submit-option.service';
import { SubmitOptionStoreDTO } from './dto/submit-option.dto';
import { SubmitOptionStoreRO, SubmitOptionUpdateRO } from './ro/submit-option.ro';

const { TAGS, CONTROLLER, STORE, UPDATE } = API.SUBMIT_OPTION;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class SubmitOptionController {
  constructor(private readonly submitOptionService: SubmitOptionService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: SubmitOptionStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: SubmitOptionStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.submitOptionService.store(dto, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: SubmitOptionUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: SubmitOptionStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.submitOptionService.update(id, dto, decoded);
  }
}
