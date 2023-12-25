import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { ROLE } from '../../role/enum/role.enum';

export const RoleGuard = (...roles: ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      return roles.some((role) => request.user.roles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
