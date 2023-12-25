import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../../role/enum/role.enum';

export const ROLE_KEY = 'role';

export const Roles = (...role: ROLE[]) => SetMetadata(ROLE_KEY, role);
