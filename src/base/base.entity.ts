export class BaseEntity {
  id: string;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;

  deletedAt: Date;

  deletedBy: string;

  constructor(data?: Partial<BaseEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
