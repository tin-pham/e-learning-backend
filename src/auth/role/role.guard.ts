import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { USER_ROLE } from '../../user/user-role.enum';
import { IRequestWithUser } from 'src/common';

export const RoleGuard = (...roles: USER_ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<IRequestWithUser>();
      const user = request.user;
      return roles.some((role) => user?.role === role);
    }
  }

  return mixin(RoleGuardMixin);
};
