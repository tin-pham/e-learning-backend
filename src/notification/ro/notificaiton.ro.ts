import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class NotificationStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class NotificationGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  courseName: string;
}

export class NotificationGetListRO extends PaginateRO<NotificationGetListDataRO> {
  @ApiProperty({ type: [NotificationGetListDataRO] })
  @Type(() => NotificationGetListDataRO)
  @Expose()
  data: NotificationGetListDataRO[];
}
