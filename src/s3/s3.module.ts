import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
