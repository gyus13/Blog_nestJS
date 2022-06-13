import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { response } from '../../config/response.utils'

// Auth관련 데코레이터
export const PatchNickname = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.nickname) {
      throw new HttpException(response.EMPTY_NICKNAME, 201);
    }
    if (body.nickname > 10) {
      throw new HttpException(response.INVALID_NICKNAME, 201);
    }
    return body;
  },
);
