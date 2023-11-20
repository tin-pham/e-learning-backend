import { ConfigService } from '@nestjs/config';
import { DatabaseOptions } from './database.options';

const configService = new ConfigService();
export const databaseConfig: DatabaseOptions = {
  host: configService.get('POSTGRES_HOST')!,
  port: configService.get('POSTGRES_PORT')!,
  user: configService.get('POSTGRES_USER')!,
  password: configService.get('POSTGRES_PASSWORD')!,
  database: configService.get('POSTGRES_DB')!,
};
