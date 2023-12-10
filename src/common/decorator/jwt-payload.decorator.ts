import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
