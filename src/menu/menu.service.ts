import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { MenuRepository } from './menu.repository';
import { MenuGetListDTO } from './dto/menu.dto';
import { MenuGetListRO } from './ro/menu.ro';

@Injectable()
export class MenuService extends BaseService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly menuRepository: MenuRepository,
  ) {
    super(elasticLogger);
  }
  async getList(dto: MenuGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.menuRepository.find(dto);

      return this.success({
        classRO: MenuGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.MENU.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }
}
