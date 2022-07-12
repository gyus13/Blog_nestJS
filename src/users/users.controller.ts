import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
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
import { DeleteDreamResponse } from '../future/dto/delete-dream.response';
import { DeleteUserRequest } from './dto/delete-user-request';
import {DeleteUserResponse} from "./dto/delete-user.response";

@Controller('users')
@ApiTags('users')
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

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: DeleteUserResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBody({ description: '회원 탈퇴', type: DeleteUserRequest })
  @UseGuards(JwtAuthGuard)
  @Delete('/:userId')
  deleteDream(
    @Param('userId') id: number,
    @Headers('x-access-token') accessToken,
  ) {
    return this.userService.deleteUser(accessToken, id);
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
  async getTicketLogs(@Request() req, @Headers('x-access-token') accessToken, @Body() deleteUserRequest: DeleteUserRequest) {
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
    type: GetMissionResponse,
  })
  @ApiOperation({ summary: '주간미션' })
  @Get('mission')
  async getMission(@Headers('x-access-token') accessToken) {
    return await this.userService.retrieveMission(accessToken);
  }
}
