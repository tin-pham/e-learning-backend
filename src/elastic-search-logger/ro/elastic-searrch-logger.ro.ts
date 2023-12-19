import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class ElasticsearchLoggerGetInfoDataRO {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  date: Date;
}

export class ElasticsearchLoggerGetInfoRO extends PaginateRO<ElasticsearchLoggerGetInfoDataRO> {
  @ApiProperty({ type: [ElasticsearchLoggerGetInfoDataRO] })
  @Type(() => ElasticsearchLoggerGetInfoDataRO)
  @Expose()
  data: ElasticsearchLoggerGetInfoDataRO[];
}

export class ElasticsearchLoggerGetErrorDataRO {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  status: number;
}

export class ElasticsearchLoggerGetErrorRO extends PaginateRO<ElasticsearchLoggerGetErrorDataRO> {
  @ApiProperty({ type: [ElasticsearchLoggerGetErrorDataRO] })
  @Type(() => ElasticsearchLoggerGetErrorDataRO)
  @Expose()
  data: ElasticsearchLoggerGetErrorDataRO[];
}
