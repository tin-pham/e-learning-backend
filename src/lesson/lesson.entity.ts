import { BaseEntity } from '../base/base.entity';

export class LessonEntity extends BaseEntity {
  title: string;

  body: string;

  fileUrls: string[];
}
