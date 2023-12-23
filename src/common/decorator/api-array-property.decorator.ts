import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Workaround to the query parameters array serialization
 * [issue](https://github.com/nestjs/swagger/issues/804):
 *
 * Add special `style` and `explode` properties according
 * to the Swagger Parameters serialization specification:
 * @see https://swagger.io/docs/specification/serialization/
 * @see https://swagger.io/docs/specification/serialization/#query
 */
export enum SwaggerQueryParamStyle {
  CSV = 'form',
  SPACE = 'spaceDelimited',
  PIPE = 'pipeDelimited',
}
export const SwaggerStyleSeparators: Record<SwaggerQueryParamStyle, string> = {
  [SwaggerQueryParamStyle.CSV]: ',',
  [SwaggerQueryParamStyle.SPACE]: ' ',
  [SwaggerQueryParamStyle.PIPE]: '|',
};

export const ApiArrayProperty = (
  style: SwaggerQueryParamStyle = SwaggerQueryParamStyle.CSV,
  valuesType: Type<unknown> | Record<string, any> = [String],
  mapperFn: (value: any, index?: number, array?: any[]) => any = (_) =>
    _.trim(),
) => {
  const swaggerProps = { type: valuesType };
  swaggerProps['style'] = style;
  swaggerProps['explode'] = false;

  return applyDecorators(
    ApiProperty(swaggerProps),
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value
          .split(SwaggerStyleSeparators[style])
          .filter((_) => _ !== '')
          .map(mapperFn);
      } else {
        return value;
      }
    }),
  );
};
