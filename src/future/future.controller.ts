import {
  Controller,
  Delete,
  Get, Headers,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTicketResponse } from '../ticket/dto/get-ticket.response';
import { GetFutureResponse } from './dto/get-future-response';
import { FutureService } from './future.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('future')
@ApiTags('future')
export class FutureController {
  constructor(private readonly futureService: FutureService) {}

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetFutureResponse,
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
  @ApiOperation({ summary: '미래의 나 조회' })
  @Get()
  async getFuture(@Request() req, @Headers('x-access-token') accessToken) {
    return await this.futureService.retrieveFuture(req, accessToken);
  }

  // @ApiOperation({ summary: '미래의 나 등록' })
  // @Post()
  // async createFuture() {
  //   return 'create Ticket';
  // }
  //
  // @ApiOperation({ summary: '미래의 나 수정' })
  // @Patch()
  // async updateFuture() {
  //   return 'create Ticket';
  // }
  //
  // @ApiOperation({ summary: '미래의 나 삭제' })
  // @Delete()
  // async deleteFuture() {
  //   return 'create Ticket';
  // }
  //
  // @ApiOperation({ summary: '상상 조회' })
  // @Get('/dream')
  // async getDreaming() {
  //   return 'this is ticket return';
  // }
  //
  // @ApiOperation({ summary: '상상 등록' })
  // @Post('/dream')
  // async createDreaming() {
  //   return 'create Ticket';
  // }
}
