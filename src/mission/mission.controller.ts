import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMissionResponse } from '../users/dto/get-mission.response';
import { UsersService } from '../users/users.service';
import { MissionService } from './mission.service';
import { PostInquireRequest } from '../users/dto/post-inquire.request';
import { PostMissionRequest } from './dto/post-mission.request';
import { PushService } from '../push/push.service';
import { PostPushRequest } from './dto/post-push.request';

@Controller('mission')
export class MissionController {
  constructor(
    private readonly missionService: MissionService,
    private readonly pushService: PushService,
  ) {}
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
  @Get()
  async getMission(@Headers('x-access-token') accessToken) {
    return await this.missionService.retrieveMission(accessToken);
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
  @ApiOperation({ summary: '개인 수동미션 업데이트' })
  @ApiBody({ description: '수동미션 업데이트 dto', type: PostMissionRequest })
  @Post()
  async postMissionByUserId(
    @Headers('x-access-token') accessToken,
    @Body() postMissionRequest: PostMissionRequest,
  ) {
    return await this.missionService.createMissionByUserId(
      accessToken,
      postMissionRequest,
    );
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiHeader({
  //   description: 'jwt token',
  //   name: 'x-access-token',
  //   example: 'JWT TOKEN',
  // })
  // @ApiResponse({
  //   status: 1000,
  //   description: '성공',
  //   type: GetMissionResponse,
  // })
  // @ApiOperation({ summary: '미션확인' })
  // @Post('/:missionId')
  // async postMissionByMissionId(
  //   @Headers('x-access-token') accessToken,
  //   @Param('missionId') id: number,
  // ) {
  //   return await this.missionService.compeleteMission(accessToken);
  // }

  @ApiOperation({ summary: '푸시' })
  @Post('push')
  async getPush(@Body() postPushRequest: PostPushRequest) {
    return await this.pushService.sendPush(postPushRequest);
  }
}
