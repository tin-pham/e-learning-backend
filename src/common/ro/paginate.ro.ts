import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaginiateMetaRO {
  @Expose()
  @ApiProperty()
  itemsPerPage: number;

  @Expose()
  @ApiProperty()
  totalItems: number;

  @Expose()
  @ApiProperty()
  totalPage: number;

  @Expose()
  @ApiProperty()
  currentPage: number;
}

export abstract class PaginateRO<PaginateDataRO> {
  abstract data: PaginateDataRO[];

  @Expose()
  @ApiProperty({ type: PaginiateMetaRO })
  @Type(() => PaginiateMetaRO)
  meta: PaginiateMetaRO;
}
