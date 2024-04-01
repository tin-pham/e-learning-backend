import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { PostAttachmentService } from './post-attachment.service';
import { S3Service } from '../s3/s3.service';
import { PostRepository } from '../post/post.repository';
import { PostAttachmentRepository } from './post-attachment.repository';
import { PostAttachmentController } from './post-attachment.controller';
import { AttachmentRepository } from '../attachment/attachment.repository';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [PostAttachmentController],
  providers: [PostAttachmentService, PostRepository, PostAttachmentRepository, S3Service, AttachmentRepository],
})
export class PostAttachmentModule {}
