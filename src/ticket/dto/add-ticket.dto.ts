import { Ticket } from '../ticket.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class AddTicketDto extends PickType(Ticket, [
  'title',
  'start',
  'end',
  'category',
  'color',
  'touchCount',
] as const) {}
