import {Controller, Get, Post, UseGuards} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('ticket')
export class TicketController {
  @ApiOperation({ summary: '티켓조회' })
  @Get()
  async getTicket() {
    return 'this is ticket return';
  }

  @ApiOperation({ summary: '티켓등록' })
  @Post()
  async createTicket() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '티켓수정' })
  @Post()
  async updateTicket() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '티켓삭제' })
  @Post()
  async deleteTicket() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '추천 티켓조회' })
  @Get()
  async getTicketByUserId() {
    return 'this is ticket return';
  }

  @ApiOperation({ summary: '모든 티켓조회' })
  @Get()
  async getAllTicket() {
    return 'this is ticket return';
  }

  @ApiOperation({ summary: '주간목표 조회' })
  @Get()
  async getGoal() {
    return 'get Goal';
  }
}
