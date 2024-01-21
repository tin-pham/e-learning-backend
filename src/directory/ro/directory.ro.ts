import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DirectoryStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  parentId: number;

  constructor(data?: DirectoryStoreRO) {
    Object.assign(this, data);
  }
}

export class DirectoryGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(data?: DirectoryStoreRO) {
    Object.assign(this, data);
  }
}

export class DirectoryGetListRO {
  @ApiProperty({ type: [DirectoryGetListDataRO] })
  @Type(() => DirectoryGetListDataRO)
  @Expose()
  data: DirectoryGetListDataRO[];

  constructor(data?: DirectoryStoreRO) {
    Object.assign(this, data);
  }
}

export class DirectoryUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(data?: DirectoryUpdateRO) {
    Object.assign(this, data);
  }
}

export class DirectoryDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: DirectoryDeleteRO) {
    Object.assign(this, data);
  }
}
