import {
  Controller,
  Patch,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  Headers,
  Param,
} from '@nestjs/common';
import {
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
    type: GetTicketResponse,
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
  @ApiQuery({ description: '티켓 ', type: AddTicketRequest })
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

  @ApiOperation({ summary: '티켓수정' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Patch('/:ticketId')
  async updateTicket(
    @Param('ticketId') id: number,
    @Headers('x-access-token') accessToken,
    @AddTicket() patchTicketRequest: AddTicketRequest,
  ) {
    return this.ticketService.patchTicket(accessToken, id, patchTicketRequest);
  }

  @ApiOperation({ summary: '티켓삭제' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Delete()
  async deleteTicket() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '추천 티켓조회' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Get('/:ticketId')
  async getTicketByUserId() {
    return 'this is ticket return';
  }

  @ApiOperation({ summary: '주간목표 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @Get('/goal')
  async getGoal() {
    return 'get Goal';
  }
}
