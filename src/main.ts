import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getLogLevels } from './logger/get-log-levels.util';

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
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Authorization',
    )
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, optionsSwagger);
  SwaggerModule.setup('docs', app, documentSwagger);

  await app.listen(3000);
}
bootstrap();
