import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class MenuGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
