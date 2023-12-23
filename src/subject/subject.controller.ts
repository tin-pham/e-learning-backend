import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { USER_ROLE } from '../user-role/user-role.enum';
import { SubjectService } from './subject.service';
import {
  SubjectGetListDTO,
  SubjectStoreDTO,
  SubjectUpdateDTO,
} from './dto/subject.dto';
import {
  SubjectGetListRO,
  SubjectStoreRO,
  SubjectUpdateRO,
} from './ro/subject.ro';

const { TAGS, CONTROLLER, STORE, GET_LIST, UPDATE } = API.SUBJECT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: SubjectStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: SubjectStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.subjectService.store(dto, decoded);
  }

  @ApiOperation({ summary: GET_LIST.OPERATION })
  @ApiOkResponse({ type: SubjectGetListRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_LIST.ROUTE)
  @UseGuards(
    JwtGuard,
    RoleGuard(USER_ROLE.ADMIN, USER_ROLE.MODERATOR, USER_ROLE.TEACHER),
  )
  getList(@Query() dto: SubjectGetListDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.subjectService.getList(dto, decoded);
  }

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: SubjectUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: SubjectUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.subjectService.update(id, dto, decoded);
  }
}