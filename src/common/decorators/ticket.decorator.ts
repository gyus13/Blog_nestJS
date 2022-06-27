import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { regularExp } from '../../config/regularExp';
import { response } from '../../config/response.utils';

export const AddTicket = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.title) {
      throw new HttpException(response.EMPTY_TITLE, 201);
    }
    if (!body.start) {
      throw new HttpException(response.EMPTY_START, 201);
    }
    if (!body.end) {
      throw new HttpException(response.EMPTY_END, 201);
    }
    if (!body.color) {
      throw new HttpException(response.EMPTY_COLOR, 201);
    }
    if (!body.category) {
      throw new HttpException(response.EMPTY_CATEGORY, 201);
    }
    if (!body.touchCount) {
      throw new HttpException(response.EMPTY_TOUCHCOUNT, 201);
    }
    return body;
  },
);

export const TouchTicket = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.title) {
      throw new HttpException('제목을 입력해 주세요.', 201);
    }
    return body;
  },
);
