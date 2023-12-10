import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { USER_ROLE } from '../../user-role/user-role.enum';

export const RoleGuard = (...roles: USER_ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      return roles.some((role) => request.user.roles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
