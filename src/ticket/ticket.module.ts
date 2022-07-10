import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entity/ticket.entity';
import {TouchCount} from "../entity/touch-count.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TouchCount]),
  ],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
