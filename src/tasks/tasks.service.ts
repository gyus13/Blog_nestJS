import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Ticket } from '../entity/ticket.entity';
import { response } from '../config/response.utils';
import { Mission } from '../entity/mission.entity';
import { MissionUser } from '../entity/mission-user.entity';
import { Connection, getManager } from 'typeorm';
import {
  defaultAfterSevenDateTimes,
  defaultCurrentDateTimes,
  getAfterSevenDayTime,
  getcurrentDateTime,
} from '../common/function.utils';
import { User } from '../entity/users.entity';

@Injectable()
export class TasksService {
  constructor(private connection: Connection) {}

  @Cron('0 0 6 * * 1')
  async missionCron() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const users = await getManager()
        .createQueryBuilder(User, 'user')
        .select('user.id')
        .getMany();

      // Ticket 인스턴스 생성 후 정보 담기
      for (let i = 0; i < users.length; i++) {
        await queryRunner.manager.update(
          MissionUser,
          { userId: users[i].id },
          { missionId: 1 },
        );

        await queryRunner.manager.update(
          MissionUser,
          { userId: users[i].id },
          { missionStartDate: defaultCurrentDateTimes() },
        );

        await queryRunner.manager.update(
          MissionUser,
          { userId: users[i].id },
          { missionEndDate: defaultAfterSevenDateTimes() },
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
