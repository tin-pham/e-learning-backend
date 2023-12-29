import { ApiProperty } from '@nestjs/swagger';
import { LEVEL } from '../enum/level.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class LevelChooseDTO {
  @ApiProperty({ enum: LEVEL })
  @IsEnum(LEVEL)
  @IsNotEmpty()
  name: LEVEL;
}
