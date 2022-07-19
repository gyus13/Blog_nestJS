import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketQuery {
  getFutureExperienceQuery = (id): string => {
    return `
            select sum(experience.value) div 100 as level,
                right(sum(experience.value),2) as experience
            from User user
                left join Experience experience
            on experience.userId = user.id
            where experience.userId = ${id}

        `;
  };

  getTicketQuery = (id): string => {
    return `
        select
            ticket.id,
            ticket.subject,
            ticket.purpose,
            ticket.color,
            ticket.category,
            ticket.touchCount
        from Ticket ticket
        where userId = ${id}
        `;
  };
}
