import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTask = createParamDecorator((_data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.currentTask;
});
