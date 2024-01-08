import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function LessThanDate(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: 'LessThanDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedPropertyValue = new Date(args.object[relatedPropertyName]);
          value = new Date(value);
          return value instanceof Date && relatedPropertyValue instanceof Date && value.getTime() < relatedPropertyValue.getTime();
        },
        defaultMessage(args?: ValidationArguments): string {
          const { property } = args;
          const [relatedPropertyName] = args.constraints;
          return `${property} must be greater than or equal ${relatedPropertyName} `;
        },
      },
    });
}
