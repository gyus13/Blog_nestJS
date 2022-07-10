import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostInquireRequest } from './dto/post-inquire.request';
import { PostInquire } from 'src/common/decorators/user.decorator';
import { PostInquireResponse } from './dto/post-inquire.response';
import {GetLogsResponse} from "./dto/get-logs.response";

@Controller('users')
@ApiTags('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @ApiOperation({ summary: '특정 회원조회' })
  // @Get('/:id')
  // async getUser(@Param('id') id: string) {
  //   return await this.userService.findUserById(id);
  // }

  // @ApiOperation({ summary: '회원탈퇴' })
  // @Delete()
  // async deleteNickname() {
  //   return 'nickname';
  // }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetLogsResponse,
  })
  @ApiOperation({ summary: '티켓기록 조회' })
  @Get('/inquire')
  async getLogs(
      @Headers('x-access-token') accessToken,
  ) {
    return await this.userService.retrieveLogs(
        accessToken
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PostInquireResponse,
  })
  @ApiOperation({ summary: '문의하기' })
  @ApiBody({ description: '문의하기', type: PostInquireRequest })
  @Post('/inquire')
  async postInquire(
    @Headers('x-access-token') accessToken,
    @PostInquire() postInquireRequest: PostInquireRequest,
  ) {
    return await this.userService.createInquiry(
      postInquireRequest,
      accessToken,
    );
  }
}
