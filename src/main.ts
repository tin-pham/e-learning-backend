import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const optionsSwagger = new DocumentBuilder()
    .setTitle('Social Media Backend')
    .setDescription('Social Media Backend API')
    .setVersion('1.0')
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

  await app.listen(3000);
}
bootstrap();
