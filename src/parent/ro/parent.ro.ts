import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ParentStoreUserRO {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty()
  @Expose()
  phone: string;
}

export class ParentStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: ParentStoreUserRO })
  @Type(() => ParentStoreUserRO)
  @Expose()
  user: ParentStoreUserRO;
}

export class ParentGetListDataUserRO {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty()
  @Expose()
  phone: string;
}

export class ParentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: ParentGetListDataUserRO })
  @Type(() => ParentGetListDataUserRO)
  @Expose()
  user: ParentGetListDataUserRO;
}

export class ParentGetListRO extends PaginateRO<ParentGetListDataRO> {
  @ApiProperty({ type: [ParentGetListDataRO] })
  @Type(() => ParentGetListDataRO)
  @Expose()
  data: ParentGetListDataRO[];
}

export class ParentGetDetailUserRO {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty()
  @Expose()
  phone: string;
}

export class ParentGetDetailRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: ParentGetDetailUserRO })
  @Type(() => ParentGetDetailUserRO)
  @Expose()
  user: ParentGetDetailUserRO;
}

export class ParentUpdateUserRO {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty()
  @Expose()
  phone: string;
}

export class ParentUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: ParentUpdateUserRO })
  @Type(() => ParentUpdateUserRO)
  @Expose()
  user: ParentUpdateUserRO;
}

export class ParentDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;
}
