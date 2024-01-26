import { FilesInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
}

export function LocalFilesInterceptor(options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = configService.get('UPLOAD_FILES_PATH');

      const destination = `${filesDestination}/${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (_, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = file.originalname.split('.').pop();
            const filename = `${uniqueSuffix}.${ext}`;
            cb(null, filename);
          },
        }),
        fileFilter: options.fileFilter,
      };

      this.fileInterceptor = new (FilesInterceptor(options.fieldName, undefined, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
