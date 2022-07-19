import {
  Controller,
  Patch,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
  Headers,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { AddTicket } from '../common/decorators/ticket.decorator';
import { AddTicketRequest } from './dto/add-ticket.request';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetTicketResponse } from './dto/get-ticket.response';
import { TouchTicketResponse } from './dto/touch-ticket.response';
import { DeleteTicketResponse } from './dto/delete-ticket.response';
import { DeleteTouchCountResponse } from './dto/delete-touch-count.response';
import { AddTicketResponse } from './dto/add-ticket.response';
import { GetOtherTicketResponse } from './dto/get-other-ticket.response';

//validation swagger에 올려주기
@Controller('ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetTicketResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '티켓조회' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Get()
  async getTicket(@Request() req, @Headers('x-access-token') accessToken) {
    return await this.ticketService.getTicket(req, accessToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: AddTicketResponse,
  })
  @ApiResponse({
    status: 2018,
    description: '티켓은 6개까지 생성 가능합니다.',
  })
  @ApiResponse({
    status: 2019,
    description: '제목을 입력해주세요.',
  })
  @ApiResponse({
    status: 2021,
    description: '목적을 입력해주세요.',
  })
  @ApiResponse({
    status: 2022,
    description: '색을 입력해주세요.',
  })
  @ApiResponse({
    status: 2023,
    description: '카테고리를 입력해주세요.',
  })
  @ApiResponse({
    status: 2024,
    description: '터치횟수를 입력해주세요.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '티켓등록' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiBody({ description: '티켓 ', type: AddTicketRequest })
  @Post()
  createTicket(
    @AddTicket() addTicketDto: AddTicketRequest,
    @Headers('x-access-token') accessToken,
  ) {
    return this.ticketService.createTicket(addTicketDto, accessToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: TouchTicketResponse,
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
  @ApiOperation({ summary: '티켓터치' })
  @UseGuards(JwtAuthGuard)
  @Post('/touch/:ticketId')
  touchTicket(
    @Param('ticketId') id: number,
    @Headers('x-access-token') accessToken,
  ) {
    return this.ticketService.touchTicket(accessToken, id);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: DeleteTouchCountResponse,
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
  @ApiOperation({ summary: '티켓터치 취소' })
  @UseGuards(JwtAuthGuard)
  @Delete('/touch/:ticketId')
  touchDeleteTicket(
    @Param('ticketId') id: number,
    @Headers('x-access-token') accessToken,
  ) {
    return this.ticketService.deleteTouchTicket(accessToken, id);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetTicketResponse,
  })
  @ApiResponse({
    status: 2019,
    description: '제목을 입력해주세요.',
  })
  @ApiResponse({
    status: 2021,
    description: '목표를 입력해주세요.',
  })
  @ApiResponse({
    status: 2022,
    description: '색을 입력해주세요.',
  })
  @ApiResponse({
    status: 2023,
    description: '카테고리를 입력해주세요.',
  })
  @ApiResponse({
    status: 2024,
    description: '터치횟수를 입력해주세요.',
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '티켓수정' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiBody({ description: '티켓 ', type: AddTicketRequest })
  @Patch('/:ticketId')
  async updateTicket(
    @Param('ticketId') id: number,
    @Headers('x-access-token') accessToken,
    @AddTicket() patchTicketRequest: AddTicketRequest,
  ) {
    return this.ticketService.patchTicket(accessToken, id, patchTicketRequest);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: DeleteTicketResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '티켓삭제' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Delete('/:ticketId')
  async deleteTicket(
    @Param('ticketId') id: number,
    @Headers('x-access-token') accessToken,
  ) {
    return this.ticketService.deleteTicket(accessToken, id);
  }

  // 스케쥴러
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetTicketResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '추천 티켓조회' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Get('/:userId')
  async getRecommendTicket(@Request() req, @Param('userId') id: number) {
    return await this.ticketService.getRecommendTicket(req, id);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetTicketResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '다른 유저 티켓조회' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Get('other/:userId')
  async getOtherTicket(@Request() req, @Param('userId') id: number) {
    const userId = 1;
    return await this.ticketService.getOtherTicket(req, userId);
  }
}
