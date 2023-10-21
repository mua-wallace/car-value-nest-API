/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, cxt: ExecutionContext) => {
    const request = cxt.switchToHttp().getRequest();
    return request.currentUser;
  },
);
