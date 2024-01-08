import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ClassroomYearService } from './classroom-year.service';
import { ClassroomYearGetDetailRO, ClassroomYearUpdateRO } from './ro/classroom-year.ro';
import { ClassroomYearUpdateDTO } from './dto/classroom-year.dto';

const { TAGS, CONTROLLER, UPDATE, GET_DETAIL } = API.CLASSROOM_YEAR;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ClassroomYearController {
  constructor(private readonly classroomYearService: ClassroomYearService) {}

  @ApiOperation({ summary: UPDATE.OPERATION })
  @ApiOkResponse({ type: ClassroomYearUpdateRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(UPDATE.ROUTE)
  @Roles(ROLE.ADMIN, ROLE.STAFF)
  @UseGuards(JwtGuard, RoleGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ClassroomYearUpdateDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.classroomYearService.update(id, dto, decoded);
  }

  @ApiOperation({ summary: GET_DETAIL.OPERATION })
  @ApiOkResponse({ type: ClassroomYearGetDetailRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_DETAIL.ROUTE)
  @Roles(ROLE.ADMIN, ROLE.STAFF)
  @UseGuards(JwtGuard, RoleGuard)
  getDetail(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.classroomYearService.getDetail(id, decoded);
  }
}
