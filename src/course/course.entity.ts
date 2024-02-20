import { BaseEntity } from '../base/base.entity';

export class CourseEntity extends BaseEntity {
  name: string;
  description: string;
  imageId?: number;
}
