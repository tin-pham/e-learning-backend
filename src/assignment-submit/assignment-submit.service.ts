import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { AttachmentEntity } from '../attachment/attachment.entity';
import { AssignmentSubmitRepository } from './assignment-submit.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { S3Service } from '../s3/s3.service';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ResultRO } from '../common/ro/result.ro';
import { AssignmentSubmitGetListDTO, AssignmentSubmitStoreDTO } from './dto/assignment-submit.dto';
import { AssignmentSubmitEntity } from './assignment-submit.entity';
import { AssignmentSubmitGetListRO } from './ro/assignment-submit.ro';

@Injectable()
export class AssignmentSubmitService extends BaseService {
  private readonly logger = new Logger(AssignmentSubmitService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly s3Service: S3Service,
    private readonly assignmentSubmitRepository: AssignmentSubmitRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly attachmentRepository: AttachmentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: AssignmentSubmitStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.validateStore(dto, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store to s3
        const s3Response = await this.s3Service.bulkUpload({ files: [dto.file], directoryPath: 'assignment' }, decoded);
        // Store attachment
        const attachmentData = new AttachmentEntity({
          url: s3Response.data[0].url,
          name: s3Response.data[0].name,
          type: s3Response.data[0].type,
          size: s3Response.data[0].size,
          createdBy: actorId,
        });
        const attachment = await this.attachmentRepository.insertWithTransaction(transaction, attachmentData);

        // Store assignment submit
        const assignmentSubmitData = new AssignmentSubmitEntity({
          assignmentId: dto.assignmentId,
          attachmentId: attachment.id,
          studentId: student.id,
          createdBy: actorId,
        });
        await this.assignmentSubmitRepository.insertWithTransaction(transaction, assignmentSubmitData);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Store file successfully',
      actorId,
    });
  }

  async getList(dto: AssignmentSubmitGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.assignmentSubmitRepository.find(dto);

      return this.success({
        classRO: AssignmentSubmitGetListRO,
        response,
        message: 'Get assignment submit list successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStore(dto: AssignmentSubmitStoreDTO, actorId: number) {
    // Check assignment exist
    const assignment = await this.assignmentRepository.getCourseIdById(dto.assignmentId);
    if (!assignment) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exist
    const student = await this.studentRepository.findOneByUserId(actorId);
    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student registered
    const registerCount = await this.courseStudentRepository.countByCourseIdAndStudentId(assignment.courseId, student.id);
    console.log(assignment.courseId, student.id);
    if (!registerCount) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.NOT_REGISTERED;
      this.throwException({ code, status, message, actorId });
    }

    return { student };
  }
}
