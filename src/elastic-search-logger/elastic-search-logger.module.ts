import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '../elastic-search/elastic-search.module';
import { ElasticsearchLoggerController } from './elastic-search-logger.controller';
import { ElasticsearchLoggerService } from './elastic-search-logger.service';

@Global()
@Module({
  imports: [ElasticsearchModule],
  controllers: [ElasticsearchLoggerController],
  providers: [ElasticsearchLoggerService],
  exports: [ElasticsearchLoggerService],
})
export class ElasticsearchLoggerModule {}
