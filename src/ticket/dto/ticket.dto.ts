import { Ticket } from '../ticket.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class TicketDto extends PickType(Ticket, ['user'] as const) {}
