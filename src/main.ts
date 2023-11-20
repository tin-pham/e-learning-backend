import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const optionsSwagger = new DocumentBuilder()
    .setTitle('Social Media Backend')
    .setDescription('Social Media Backend API')
    .setVersion('1.0')
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, optionsSwagger);
  SwaggerModule.setup('docs', app, documentSwagger);
  await app.listen(3000);
}
bootstrap();
