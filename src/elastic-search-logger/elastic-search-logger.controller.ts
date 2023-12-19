import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
import { API, HttpExceptionRO } from '../common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { USER_ROLE } from '../user-role/user-role.enum';
import { ElasticsearchLoggerService } from './elastic-search-logger.service';
import { PaginateDTO } from 'src/common/dto/paginate.dto';
import {
  ElasticsearchLoggerGetErrorRO,
  ElasticsearchLoggerGetInfoRO,
} from './ro/elastic-searrch-logger.ro';

const { TAGS, CONTROLLER, GET_ERROR, GET_INFO } = API.LOG;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ElasticsearchLoggerController {
  constructor(
    private readonly elasticsearchLoggerService: ElasticsearchLoggerService,
  ) {}

  @ApiOperation({ summary: GET_ERROR.OPERATION })
  @ApiOkResponse({ type: ElasticsearchLoggerGetErrorRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_ERROR.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  getError(@Query() dto: PaginateDTO) {
    return this.elasticsearchLoggerService.getError(dto);
  }

  @ApiOperation({ summary: GET_INFO.OPERATION })
  @ApiOkResponse({ type: ElasticsearchLoggerGetInfoRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_INFO.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  getInfo(@Query() dto: PaginateDTO) {
    return this.elasticsearchLoggerService.getInfo(dto);
  }
}
