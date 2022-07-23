import { Injectable } from '@nestjs/common';
import { MissionUser } from 'src/entity/mission-user.entity';
import { Connection, getConnection, getManager } from 'typeorm';
import {
  dateToString,
  decodeJwt,
  defaultCurrentDateTime, getAfterSevenDayTime, getcurrentDateTime,
  makeResponse,
} from '../common/function.utils';
import { response } from '../config/response.utils';
import { MissionQuery } from './mission.query';
import { Ticket } from '../entity/ticket.entity';
import { User } from '../entity/users.entity';

@Injectable()
export class MissionService {
  constructor(
    private connection: Connection,
    private missionQuery: MissionQuery,
  ) {}

  async retrieveMission(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const mission = await queryRunner.query(
        this.missionQuery.getWeekMissionQuery(decodeToken.sub),
      );
      console.log(mission);

      const data = {
        mission: mission,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createMission(accessToken, postMissionRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const users = await getManager()
        .createQueryBuilder(User, 'user')
        .select('user.id')
        .getMany();
      console.log(users.length)
      for (let i = 0; i < users.length; i++) {
        console.log(users[i].id)
        const mission = new MissionUser();
        mission.missionId = 1;
        mission.userId = users[i].id;
        mission.missionStartDate = getcurrentDateTime();
        mission.missionEndDate = getAfterSevenDayTime();
        await queryRunner.manager.save(mission);
      }

      // const data = {
      //   mission: mission,
      // };
      //
      // const result = makeResponse(response.SUCCESS, data);
      //
      // return result;
      await queryRunner.commitTransaction();
      // return result;
    } catch (error) {
      console.log(error);
      // Rollback
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
