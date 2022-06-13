import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { regularExp } from '../../config/regularExp';
import { response } from '../../config/response.utils';

// Auth관련 데코레이터
export const SignInUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.email) {
      throw new HttpException(response.EMPTY_EMAIL, 201);
    }
    if (!regularExp.emailRegex.test(body.email)) {
      throw new HttpException(response.INVALID_EMAIL, 201);
    }
    if (!body.password) {
      throw new HttpException(response.EMPTY_PASSWORD, 201);
    }
    if (!regularExp.passwordRegex.test(body.password)) {
      throw new HttpException(response.INVALID_PASSWORD, 201);
    }
    return body;
  },
);

export const SignUpUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.email) {
      throw new HttpException(response.EMPTY_EMAIL, 201);
    }
    if (!regularExp.emailRegex.test(body.email)) {
      throw new HttpException(response.INVALID_EMAIL, 201);
    }
    if (!body.password) {
      throw new HttpException(response.EMPTY_PASSWORD, 201);
    }
    if (!regularExp.passwordRegex.test(body.password)) {
      throw new HttpException(response.INVALID_PASSWORD, 201);
    }
    if (!body.confirmPassword) {
      throw new HttpException(response.EMPTY_CONFIRM_PASSWORD, 201);
    }
    if (!regularExp.passwordRegex.test(body.confirmPassword)) {
      throw new HttpException(response.INVALID_CONFIRM_PASSWORD, 201);
    }
    if (body.password !== body.confirmPassword) {
      throw new HttpException(response.NOT_MATCH_CONFIRM_PASSWORD, 201);
    }
    if (!body.nickname) {
      throw new HttpException(response.EMPTY_NICKNAME, 201);
    }
    if (body.nickname.length > 20) {
      throw new HttpException(response.INVALID_NICKNAME, 201);
    }
    return body;
  },
);

export const AddTicket = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.title) {
      throw new HttpException('제목을 입력해 주세요.', 201);
    }
    if (!regularExp.emailRegex.test(body.email)) {
      throw new HttpException(response.INVALID_EMAIL, 201);
    }
  },
);
