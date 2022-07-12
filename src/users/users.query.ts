import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQuery {
  getDreamCountLogsQuery = (id): string => {
    return `
        select dream.id
        from Dream dream
        where dream.userId = ${id} and dream.isSuccess = true
        `;
  };

  getTicketCountLogsQuery = (id): string => {
    return `
        select ticket.id
        from Ticket ticket
        where ticket.userId = ${id} and ticket.isSuccess = 'Success'
        `;
  };

  getMissionCountLogsQuery = (id): string => {
    return `
        select mission.id
        from Mission mission
                 inner join MissionUser mu on mission.id = mu.missionId
        where mu.isSuccess = 1 and mu.userId = ${id}
    `;
  };

  getMissionQuery = (id): string => {
    return `
            select mission.id,
                   mission.mission,
                   mu.isSuccess,
                   date_format(mu.updatedAt, \'%Y.%m.%d\') as updatedAt
            from Mission mission
                     inner join MissionUser mu on mission.id = mu.missionId
                     inner join User user on user.id = mu.userId
            where mu.isSuccess = 1 and mu.userId = ${id}
        `;
  };

  getDreamQuery = (id): string => {
    return `
        select dream.id,
               dream.subject,
               dream.purpose,
               dream.color,
               date_format(dream.updatedAt, \'%Y.%m.%d\') as updatedAt
        from Dream dream
        where dream.isSuccess = 1 and dream.userId = ${id}
        `;
  };

  getWeekMissionQuery = (id): string => {
    return `
            select mission.id,
                   mission.mission,
                   mu.isSuccess
            from Mission mission
                     inner join MissionUser mu on mission.id = mu.missionId
                     inner join User user on user.id = mu.userId
            where mu.isSuccess = 0 and mu.userId = ${id}
            limit 1
        `;
  };

  getTicketTouchCountLogsQuery = (id): string => {
    return `
            select touchCount.id
            from TouchCount touchCount
                     left join Ticket ticket on ticket.id = touchCount.ticketId
            where ticket.userId = ${id}
        `;
  };
}
