import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
import { ResultRO } from '../common/ro/result.ro';
import { AssignmentAttachmentService } from './assignment-attachment.service';
import { AssignmentAttachmentBulkStoreDTO } from './dto/assignment-attachment.dto';

const { TAGS, CONTROLLER, BULK_STORE } = API.ASSIGNMENT_ATTACHMENT;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AssignmentAttachmentController {
  constructor(private readonly assignmentAttachmentService: AssignmentAttachmentService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  @Post(BULK_STORE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkStore(@Body() dto: AssignmentAttachmentBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.assignmentAttachmentService.bulkStore(dto, decoded);
  }
}
