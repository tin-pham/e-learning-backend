import { Controller, Get } from '@nestjs/common';
import { API } from '../common';
import { ElasticSearchLoggerService } from './elastic-search-logger.service';
import { ApiTags } from '@nestjs/swagger';

const { CONTROLLER, TAGS, GET_DETAIL: GET } = API.LOG;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class ElasticSearchLoggerController {
  constructor(
    private readonly elasticSearchLoggerService: ElasticSearchLoggerService,
  ) {}

  @Get(GET.ROUTE)
  getDetail() {
    return this.elasticSearchLoggerService.getDetail();
  }
}
