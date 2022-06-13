import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { AddTicketDto } from './dto/add-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}
  async findTicket() {
    return await this.ticketRepository.find();
  }

  async createTicket(addTicket: AddTicketDto) {
    await this.ticketRepository.create({
      ...addTicket,
    });
  }
}
