import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class YearStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: '2023-2024' })
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiProperty()
  @Expose()
  endDate: Date;
}

export 

export class YearGetListRO extends PaginateRO  
