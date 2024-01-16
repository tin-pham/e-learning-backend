import { ApiProperty } from '@nestjs/swagger';
import { PaginateRO } from '../../common/ro/paginate.ro';
import { Expose, Type } from 'class-transformer';

export class FileGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}

export class FileGetListRO extends PaginateRO<FileGetListDataRO> {
  @ApiProperty({ type: [FileGetListDataRO] })
  @Type(() => FileGetListDataRO)
  @Expose()
  data: FileGetListDataRO[];
}
