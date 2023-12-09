import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { IRequestWithUser } from 'src/common';
import { USER_ROLE } from '../../user-role/user-role.enum';

export const RoleGuard = (...roles: USER_ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<IRequestWithUser>();
      const user = request.user;
      const userRoles = user.roles.map((role) => role.name);
      return roles.every((role) => userRoles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
