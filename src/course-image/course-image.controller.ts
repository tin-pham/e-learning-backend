import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { CourseImageUpsertDTO } from './dto/course-image.dto';
import { ResultRO } from '../common/ro/result.ro';
import { CourseImageService } from './course-image.service';

const { TAGS, CONTROLLER, UPSERT } = API.COURSE_IMAGE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class CourseImageController {
  constructor(private readonly courseImageController: CourseImageService) {}

  @ApiOperation({ summary: UPSERT.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(UPSERT.ROUTE)
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  upsert(@Param('courseId', ParseIntPipe) courseId: number, @Body() dto: CourseImageUpsertDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.courseImageController.upsert(courseId, dto, decoded);
  }
}
