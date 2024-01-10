import { Injectable } from '@nestjs/common';
import { BaseService } from '../base';
import { IJwtPayload } from '../common';
import { CourseStoreDTO } from './dto/course.dto';

@Injectable()
export class CourseService extends BaseService {
  async store(dto: CourseStoreDTO, decoded: IJwtPayload) {

  }

  private async validateStore(dto: CourseStoreDTO, actorId: string) {
    // Check  
  }
}
