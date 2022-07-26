import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param, Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostInquireRequest } from './dto/post-inquire.request';
import { PostInquire } from 'src/common/decorators/user.decorator';
import { PostInquireResponse } from './dto/post-inquire.response';
import { GetLogsResponse } from './dto/get-logs.response';
import { Category } from '../config/variable.utils';
import { GetMissionLogsResponse } from './dto/get-mission-logs.response';
import { GetDreamLogsResponse } from './dto/get-dream-logs-response';
import { GetTicketLogsResponse } from './dto/get-ticket-logs.response';
import { GetMissionResponse } from './dto/get-mission.response';
import { GetEmailResponse } from './dto/get-email.response';
import { PostEmailRequest } from './dto/post-email.request';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
  @ApiOperation({ summary: '메인기록 조회' })
  @Get('logs/main')
  async getLogs(@Headers('x-access-token') accessToken) {
    return await this.userService.retrieveMainLogs(accessToken);
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
    type: GetMissionLogsResponse,
  })
  @ApiOperation({ summary: '미션기록 조회' })
  @Get('logs/mission')
  async getMissionLogs(@Headers('x-access-token') accessToken) {
    return await this.userService.retrieveMissionLogs(accessToken);
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
    type: GetDreamLogsResponse,
  })
  @ApiOperation({ summary: '상상하기 기록 조회' })
  @Get('logs/dream')
  async getDreamLogs(@Headers('x-access-token') accessToken) {
    return await this.userService.retrieveDreamLogs(accessToken);
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
    type: GetTicketLogsResponse,
  })
  @ApiOperation({ summary: '티켓기록 조회' })
  @ApiQuery({ name: 'category', enum: Category, required: false })
  @Get('/logs/ticket')
  async getTicketLogs(@Request() req, @Headers('x-access-token') accessToken) {
    return await this.userService.retrieveTicketLogs(accessToken, req);
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

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetEmailResponse,
  })
  @ApiOperation({ summary: '이메일 추출' })
  @Get('email')
  async getEmail(@Headers('x-access-token') accessToken) {
    return await this.userService.retrieveEmail(accessToken);
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
    type: GetEmailResponse,
  })
  @ApiOperation({ summary: '이메일 입력' })
  @ApiBody({ description: '이메일 입력', type: PostEmailRequest })
  @Patch('email')
  async editEmail(@Headers('x-access-token') accessToken, @Body() postEmailRequest:PostEmailRequest) {
    return await this.userService.editEmail(accessToken, postEmailRequest);
  }
}
