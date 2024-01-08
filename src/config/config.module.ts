import * as Joi from 'joi';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigFactory, ConfigModuleOptions, ConfigModule as NestConfigModule } from '@nestjs/config';
import { configSchema } from './config.schema';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: options.envFilePath || '.env.local',
          validationSchema: Joi.object({ ...configSchema }),
        }),
      ],
    };
  }

  // noinspection JSUnusedGlobalSymbols
  static forFeature(options: ConfigFactory) {
    return NestConfigModule.forFeature(options);
  }
}
