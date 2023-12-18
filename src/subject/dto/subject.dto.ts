import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginateDTO } from 'src/common/dto/paginate.dto';

export class SubjectStoreDTO {
  @ApiProperty({ example: 'Math' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SubjectGetListDTO extends PaginateDTO {}
