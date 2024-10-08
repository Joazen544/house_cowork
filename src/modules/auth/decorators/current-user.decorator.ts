import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((_data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  if (!request.user) {
    throw new UnauthorizedException('User not authenticated');
  }

  return request.user;
});
