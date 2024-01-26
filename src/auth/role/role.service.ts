import { Injectable } from '@nestjs/common';
import { ROLE } from '../../role/enum/role.enum';

interface IsAuthorizedParams {
  currentRoles: ROLE[];
  requiredRole: ROLE;
}

@Injectable()
export class RoleService {
  private hierarchies: Array<Map<string, number>> = [];
  private priority: number = 1;

  constructor() {
    this.buildRoles([ROLE.MODERATOR, ROLE.ADMIN]);
    this.buildRoles([ROLE.TEACHER, ROLE.FORM_TEACHER, ROLE.PRINCIPAL]);
    this.buildRoles([ROLE.STAFF]);
    this.buildRoles([ROLE.STUDENT]);
  }

  /**
   * The buildRoles method allows for creating a role hierarchy between specified set of roles.
   * Roles have to be specified from least privileged user to the most priviliged one
   * @param roles Array that contains list of roles
   */
  private buildRoles(roles: ROLE[]) {
    const hierarchy: Map<string, number> = new Map();
    roles.forEach((role) => {
      hierarchy.set(role, this.priority);
      this.priority++;
    });
    this.hierarchies.push(hierarchy);
  }

  public isAuthorized({ currentRoles, requiredRole }: IsAuthorizedParams) {
    for (const hierarchy of this.hierarchies) {
      for (const currentRole of currentRoles) {
        const priority = hierarchy.get(currentRole);
        const requiredPriority = hierarchy.get(requiredRole);
        if (priority && requiredPriority && priority >= requiredPriority) {
          return true;
        }
      }
    }
    return false;
  }
}
