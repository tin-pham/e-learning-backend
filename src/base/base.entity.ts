export class BaseEntity {
  id?: number;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;

  deletedAt?: Date;

  deletedBy?: number;

  constructor(data?: Partial<BaseEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
