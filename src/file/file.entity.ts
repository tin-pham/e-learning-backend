import { BaseEntity } from '../base/base.entity';

export class FileEntity extends BaseEntity {
  url: string;

  constructor(data: Partial<FileEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
