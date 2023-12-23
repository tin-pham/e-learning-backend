import { Injectable, Logger } from '@nestjs/common';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { StudentEntity } from './student.entity';
import { StudentRepository } from './student.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { UserService } from '../user/user.service';
import { StudentStoreDTO, StudentUpdateDTO } from './dto/student.dto';
import { UserGetListDTO } from '../user/dto/user.dto';
import {
  StudentDeleteRO,
  StudentGetDetailRO,
  StudentGetListRO,
  StudentStoreRO,
  StudentUpdateRO,
} from './ro/student.ro';

@Injectable()
export class StudentService extends UserService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    userRoleRepository: UserRoleRepository,
    private readonly database: DatabaseService,
    private readonly studentRepository: StudentRepository,
  ) {
    super(elasticLogger, userRepository, roleRepository, userRoleRepository);
  }

  async store(dto: StudentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await super.validateStore(dto, actorId);
    const response = new StudentStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store user
        const user = await super.storeWithTransaction(
          transaction,
          dto,
          decoded.userId,
        );

        // Get student role id
        const { id: roleId } = await this.roleRepository.getIdByName(
          USER_ROLE.STUDENT,
        );

        // Store user role
        await super.storeUserRoleWithTransaction(transaction, user.id, roleId);

        // Store student
        const studentData = new StudentEntity();
        studentData.userId = user.id;
        const { id } = await this.studentRepository.insertWithTransaction(
          transaction,
          studentData,
        );

        // Set response
        response.id = id;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: StudentStoreRO,
      response,
      message: 'Student stored successfully',
      actorId,
    });
  }

  async getList(dto: UserGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.studentRepository.find(dto);
      return this.success({
        classRO: StudentGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async getDetail(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const response = new StudentGetDetailRO();

    try {
      const student = await this.studentRepository.findUserById(id);

      if (!student) {
        const { code, status, message } = EXCEPTION.STUDENT.NOT_FOUND;
        this.throwException({ code, status, message, actorId });
      }

      response.id = student.id;
      response.username = student.username;
      response.email = student.email;
      response.phone = student.phone;
      response.displayName = student.displayName;
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({ classRO: StudentGetDetailRO, response });
  }

  async update(id: string, dto: StudentUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new StudentUpdateRO();

    try {
      const { userId } = await this.studentRepository.getUserIdByStudentId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Update user
        const user = await super.updateWithTransaction(
          transaction,
          userId,
          dto,
          actorId,
        );

        // Set response
        response.id = id;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: StudentUpdateRO,
      response,
      message: 'Student updated successfully',
      actorId,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      const { userId } = await this.studentRepository.getUserIdByStudentId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Delete user
        await super.deleteWithTransaction(transaction, userId, decoded.userId);
        // Delete user role
        await super.deleteUserRoleWithTransaction(transaction, userId);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: StudentDeleteRO,
      response: {
        id,
      },
    });
  }

  private async validateUpdate(
    id: string,
    dto: StudentUpdateDTO,
    actorId: string,
  ) {
    // Check id exists
    const student = await this.studentRepository.findOneById(id);
    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }

    // Check email unique
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmailExceptId(
        dto.email,
        student.userId,
      );
      if (emailCount) {
        const { code, status, message } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.throwException({
          code,
          status,
          message,
          actorId,
        });
      }
    }

    // Check phone unique
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhoneExceptId(
        dto.phone,
        student.userId,
      );
      if (phoneCount) {
        const { code, status, message } = EXCEPTION.USER.PHONE_ALREADY_EXISTS;
        this.throwException({
          code,
          status,
          message,
          actorId,
        });
      }
    }

    return {
      student,
    };
  }

  private async validateDelete(id: string, actorId: string) {
    // Check id exists
    const studentCount = await this.studentRepository.countById(id);
    if (!studentCount) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
