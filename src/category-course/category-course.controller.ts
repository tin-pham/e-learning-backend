import { Controller, Delete, Query, UseGuards } from '@nestjs/common';
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
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { ResultRO } from '../common/ro/result.ro';
import { CategoryCourseDeleteDTO } from './dto/category-course.dto';
import { CategoryCourseService } from './category-course.service';

const { TAGS, CONTROLLER, DELETE } = API.CATEGORY_COURSE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class CategoryCourseController {
  constructor(private readonly categoryCourseService: CategoryCourseService) {}

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Query() dto: CategoryCourseDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.categoryCourseService.delete(dto, decoded);
  }
}
