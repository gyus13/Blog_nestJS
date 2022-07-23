import { Injectable } from '@nestjs/common';

@Injectable()
export class MissionQuery {
  getWeekMissionQuery = (id): string => {
    return `
        select mission.id,
               mission.mission,
               mu.isSuccess,
               TIMEDIFF(mu.missionEndDate,NOW()) as timeDiff
        from Mission mission
                 inner join MissionUser mu on mission.id = mu.missionId
                 inner join User user on user.id = mu.userId
        where mu.isSuccess = 0 and mu.userId = ${id}
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
