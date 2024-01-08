import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from './role.decorator';
import { ROLE } from '../../role/enum/role.enum';
import { RoleService } from './role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();

    for (const requireRole of requiredRoles) {
      const result = this.roleService.isAuthorized({
        requiredRole: requireRole,
        currentRoles: request.user.roles,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
