import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { getLogLevels } from './logger/get-log-levels.util';
import { HttpExceptionFilter } from './common';
import { ElasticsearchLoggerService } from './elastic-search-logger/elastic-search-logger.service';
import { CustomValidationPipe } from './common/pipe/validation.pipe';
import { TrimStringsPipe } from './common/pipe/trim.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  const optionsSwagger = new DocumentBuilder()
    .setTitle('School Media Backend')
    .setDescription('Social Media Backend API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Authorization',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-Token',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Refresh',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
      'api-key',
    )
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, optionsSwagger);
  SwaggerModule.setup('docs', app, documentSwagger);

  const options = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(options);
  app.use(helmet());

  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
    new TrimStringsPipe(),
  );

  const elasticLogger = app.get<ElasticsearchLoggerService>(ElasticsearchLoggerService);
  app.useGlobalFilters(new HttpExceptionFilter(elasticLogger));

  await app.listen(3000);
}
bootstrap();
