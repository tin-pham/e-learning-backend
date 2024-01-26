import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class SubmitStoreDTO {
  @ApiProperty()
  @IsNumber()
  exerciseId: number;
}

export class SubmitGetListDTO extends PaginateDTO {}
