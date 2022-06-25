import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTicketResponse } from '../ticket/dto/get-ticket.response';

@Controller('future')
@ApiTags('future')
export class FutureController {
  // @ApiResponse({
  //   status: 1000,
  //   description: '성공',
  //   type: GetTicketResponse,
  // })
  // @ApiResponse({
  //   status: 4000,
  //   description: '서버 에러',
  // })
  // @ApiOperation({ summary: '미래의 나 조회' })
  // @Get()
  // async getFuture() {
  //   return 'this is ticket return';
  // }
  //
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
