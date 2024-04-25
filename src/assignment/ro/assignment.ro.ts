import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class AssignmentStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  constructor(data?: AssignmentStoreRO) {
    Object.assign(this, data);
  }
}

export class AssignmentUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  constructor(data?: AssignmentStoreRO) {
    Object.assign(this, data);
  }
}

export class AssignmentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  @ApiProperty()
  @Expose()
  submissionId?: number;

  @ApiProperty()
  @Expose()
  submissionDate?: Date;

  @ApiProperty()
  @Expose()
  submissionGrade?: number;
}

export class AssignmentGetListRO extends PaginateRO<AssignmentGetListDataRO> {
  @ApiProperty({ type: [AssignmentGetListDataRO] })
  @Type(() => AssignmentGetListDataRO)
  @Expose()
  override data: AssignmentGetListDataRO[];
}

export class AssignmentGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: object;

  @ApiProperty()
  @Expose()
  dueDate: Date;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  createdByDisplayName: string;

  @ApiProperty()
  @Expose()
  submissionId?: number;

  @ApiProperty()
  @Expose()
  submissionDate?: Date;

  @ApiProperty()
  @Expose()
  submissionGrade?: number;

  @ApiProperty()
  @Expose()
  lessonId?: number;

  @ApiProperty()
  @Expose()
  lessonTitle?: string;

  @ApiProperty()
  @Expose()
  sectionId?: number;

  @ApiProperty()
  @Expose()
  courseId?: number;

  constructor(data?: AssignmentGetDetailRO) {
    Object.assign(this, data);
  }
}

export class AssignmentDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: AssignmentDeleteRO) {
    Object.assign(this, data);
  }
}

export class AssignmentGetSubmissionRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  attachmentUrl: string;

  @ApiProperty()
  @Expose()
  attachmentName: string;

  @ApiProperty()
  @Expose()
  attachmentCreatedAt: Date;

  @ApiProperty()
  @Expose()
  attachmentCreatedBy: number;
}

export class AssignmentGetMyListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;
}

export class AssignmentGetMyListRO extends PaginateRO<AssignmentGetMyListDataRO> {
  @ApiProperty({ type: [AssignmentGetMyListDataRO] })
  @Type(() => AssignmentGetMyListDataRO)
  @Expose()
  data: AssignmentGetMyListDataRO[];
}
