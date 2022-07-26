import { Injectable } from '@nestjs/common';

@Injectable()
export class MissionQuery {
  getWeekMissionQuery = (id): string => {
    return `
        select mu.id,
               mission.mission,
               TIMESTAMPDIFF(second,NOW(),mu.missionEndDate) as time
        from Mission mission
                 inner join MissionUser mu on mission.id = mu.missionId
                 inner join User user on user.id = mu.userId
        where  mu.userId = ${id}
        order by mu.createdAt DESC
            limit 1
        `;
  };

  getUserQuery = (): string => {
    return `
            select user.id
            from User user
        `;
  };
}
