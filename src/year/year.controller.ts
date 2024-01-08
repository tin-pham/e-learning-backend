import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { Roles } from '../auth/role/role.decorator';
import { JwtPayload } from '../common/decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { YearService } from './year.service';
import { YearDeleteRO, YearGetListRO, YearStoreRO, YearUpdateRO } from './ro/year.ro';
import { YearGetListDTO, YearUpdateDTO } from './dto/year.dto';

const { TAGS, CONTROLLER, CREATE, GET_LIST, UPDATE, DELETE } = API.YEAR;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class YearController {
  constructor(private readonly yearService: YearService) {}

  @ApiOperation({ summary: CREATE.OPERATION })
  @ApiCreatedResponse({ type: YearStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(CREATE.ROUTE)
  @Roles(ROLE.PRINCIPAL, ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@JwtPayload() decoded: IJwtPayload) {
    return this.yearService.create(decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: YearGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.TEACHER, ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: YearGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.yearService.getList(dto, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: YearUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.PRINCIPAL, ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: YearUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.yearService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: YearDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.TEACHER, ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.yearService.delete(id, decoded);
  }
}
