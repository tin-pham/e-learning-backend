import { Injectable, ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe as NestValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

// [
//   ValidationError {
//     target: CategoryStoreDTO {},
//     value: undefined,
//     property: 'name',
//     children: [],
//     constraints: { isNotEmpty: 'CATEGORY.NAME.IS_NOT_EMPTY' }
//   },
//   ValidationError {
//     target: CategoryStoreDTO {},
//     value: undefined,
//     property: 'description',
//     children: [],
//     constraints: { isString: 'CATEGORY.DESCRIPTION.FORMAT_IS_NOT_VALID' }
//   }
// ]

@Injectable()
export class CustomValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors: ValidationError[]) => {
        // Map over each ValidationError to extract error messages
        const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}));
        // Throw a BadRequestException with the array of error messages
        return new BadRequestException({
          code: errorMessages,
        });
      },
    });
  }
}
