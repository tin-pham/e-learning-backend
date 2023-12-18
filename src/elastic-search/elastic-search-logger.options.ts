import { ClientOptions } from '@elastic/elasticsearch';
import { ROLLING_INDEX_MODE } from './elastic-search-logger.util';

export class ElasticSearchLoggerOptions {
  public name: string;
  public indexPrefix: string;
  public rollingOffsetMode: ROLLING_INDEX_MODE;
  public stdout: boolean;
  public elasticsearchClientOptions: ClientOptions;
}
