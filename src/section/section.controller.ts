import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
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
import { SectionService } from './section.service';
import { SectionGetDetailDTO, SectionGetListDTO, SectionStoreDTO, SectionUpdateDTO } from './dto/section.dto';
import { SectionDeleteRO, SectionGetDetailRO, SectionGetListRO, SectionStoreRO, SectionUpdateRO } from './ro/section.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, GET_DETAIL, UPDATE, DELETE } = API.SECTION;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: SectionStoreRO })
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
  store(@Body() dto: SectionStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.sectionService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: SectionGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getList(@Query() dto: SectionGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.sectionService.getList(dto, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: SectionGetDetailRO })
  @ApiNotFoundResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  getDetail(@Param('id', ParseIntPipe) id: number, @Query() dto: SectionGetDetailDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.sectionService.getDetail(id, dto, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: SectionUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: SectionUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.sectionService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: SectionDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.sectionService.delete(id, decoded);
  }
}
