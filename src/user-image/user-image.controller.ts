import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
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
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { UserImageUpsertDTO } from './dto/user-image.dto';
import { UserImageService } from './user-image.service';
import { UserImageDeleteRO, UserImageUpsertRO } from './ro/user-image.ro';

const { TAGS, CONTROLLER, UPSERT, DELETE } = API.USER_IMAGE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class UserImageController {
  constructor(private readonly userImageService: UserImageService) {}

  @ApiOperation({ summary: UPSERT.OPERATION })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: UserImageUpsertRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(UPSERT.ROUTE)
  @FormDataRequest()
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  upsert(@Body() dto: UserImageUpsertDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.userImageService.upsert(dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: UserImageDeleteRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.userImageService.delete(id, decoded);
  }
}
