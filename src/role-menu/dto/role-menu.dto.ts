import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class RoleMenuBulkStoreDTO {
  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  roleIds: number[];

  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  menuIds: number[];
}
