import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('ticket')
export class TicketController {
  @ApiOperation({ summary: '티켓조회' })
  @Get()
  async getTicket() {
    return 'this is ticket return';
  }
}
