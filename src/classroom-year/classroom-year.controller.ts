import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
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
import { ClassroomYearUpdateRO } from './ro/classroom-year.ro';
import { ClassroomYearUpdateDTO } from './dto/classroom-year.dto';

const { TAGS, CONTROLLER, UPDATE } = API.CLASSROOM_YEAR;

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
  @Roles(ROLE.STAFF)
  @UseGuards(JwtGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() dto: ClassroomYearUpdateDTO,
    @JwtPayload() decoded: IJwtPayload,
  ) {
    return this.classroomYearService.update(id, dto, decoded);
  }
}
