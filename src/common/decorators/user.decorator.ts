import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const AddTitle = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.subject) {
      throw new HttpException('제목을 입력해 주세요.', 201);
    }
    return body;
  },
);

export const PostInquire = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.inquiry) {
      throw new HttpException('문의사항을 입력해주세요', 201);
    }
    return body;
  },
);

export const AddDream = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = ctx.switchToHttp().getRequest().body;
    if (!body.subject) {
      throw new HttpException('제목을 입력해 주세요.', 201);
    }

    if (!body.purpose) {
      throw new HttpException('목표을 입력해 주세요.', 201);
    }

    if (!body.color) {
      throw new HttpException('컬러을 입력해 주세요.', 201);
    }

    return body;
  },
);
