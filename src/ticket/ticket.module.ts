import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entity/ticket.entity';
import { TouchCount } from '../entity/touch-count.entity';
import { TicketQuery } from './ticket.query';
import { CharacterUser } from '../entity/character-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TouchCount, CharacterUser])],
  providers: [TicketService, TicketQuery],
  controllers: [TicketController],
})
export class TicketModule {}
