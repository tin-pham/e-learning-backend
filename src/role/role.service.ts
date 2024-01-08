import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { plainToInstance } from 'class-transformer';
import { RoleGetListRO } from './ro/role.ro';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getList() {
    const roles = await this.roleRepository.getAll();

    return plainToInstance(RoleGetListRO, { data: roles }, { excludeExtraneousValues: true });
  }
}
