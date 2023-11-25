import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../base';
import { EXCEPTION } from '../common';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { UserStoreDTO } from './dto/user.dto';
import { UserStoreRO } from './ro/user.ro';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async store(dto: UserStoreDTO) {
    await this.validateStore(dto);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const userData = new UserEntity();
    userData.username = dto.username;
    userData.password = hashedPassword;
    userData.email = dto.email;
    userData.phone = dto.phone;
    userData.displayName = dto.displayName;

    const response = new UserStoreRO();

    try {
      const user = await this.userRepository.store(userData);

      response.username = user.username;
      response.email = user.email;
      response.phone = user.phone;
      response.displayName = user.displayName;
    } catch (exception) {
      const { status, code, message } = EXCEPTION.USER.FAILED_TO_CREATE;
      this.formatException({
        status,
        code,
        message,
      });
    }

    return plainToInstance(UserStoreRO, response, { strategy: 'exposeAll' });
  }

  private async validateStore(dto: UserStoreDTO) {
    const userNameCount = await this.userRepository.countByUserName(
      dto.username,
    );
    if (userNameCount) {
      const { status, code, message } = EXCEPTION.USER.USERNAME_ALREADY_EXISTS;
      this.formatException({
        status,
        code,
        message,
      });
    }

    if (dto.email) {
      const emailCount = await this.userRepository.countByEmail(dto.email);
      if (emailCount) {
        const { status, code, message } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.formatException({
          status,
          code,
          message,
        });
      }
    }
  }
}
