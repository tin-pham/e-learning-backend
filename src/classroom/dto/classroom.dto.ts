import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginateDTO } from 'src/common/dto/paginate.dto';

export class ClassroomStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gradeId: string;
}

export class ClassroomGetListDTO extends PaginateDTO {}
