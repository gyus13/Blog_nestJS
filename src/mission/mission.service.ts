import { Injectable } from '@nestjs/common';
import { MissionUser } from 'src/entity/mission-user.entity';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import {
  dateToString,
  decodeJwt,
  defaultCurrentDateTime,
  defaultCurrentDateTimes,
  getAfterSevenDayTime,
  getcurrentDateTime,
  getRemainingTime,
  makeResponse,
} from '../common/function.utils';
import { response } from '../config/response.utils';
import { MissionQuery } from './mission.query';
import { Ticket } from '../entity/ticket.entity';
import { User } from '../entity/users.entity';
import { CharacterUser } from '../entity/character-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TitleUser } from '../entity/title-user.entity';
import { Experience } from '../entity/experience.entity';
import { Mission } from '../entity/mission.entity';

@Injectable()
export class MissionService {
  constructor(
    private connection: Connection,
    private missionQuery: MissionQuery,
    @InjectRepository(MissionUser)
    private readonly muRepository: Repository<MissionUser>,
    @InjectRepository(CharacterUser)
    private cuRepository: Repository<CharacterUser>,
  ) {}

  async retrieveMission(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const mission = await getManager()
        .createQueryBuilder(MissionUser, 'mu')
        .leftJoin(Mission, 'mission', 'mission.id = mu.missionId')
        .select(['mu.id as id', 'mu.isSuccess as isSuccess'])
        .addSelect('TIMESTAMPDIFF(second,NOW(),mu.missionEndDate) as time')
        .addSelect('mission.mission as mission')
        .where('mu.userId IN (:userId)', { userId: decodeToken.sub })
        .getRawMany();

      console.log(mission);

      // getRemainingTime(mission[0].time);

      const data = {
        id: mission[0].id,
        mission: mission[0].mission,
        isSuccess: mission[0].isSuccess,
        remainTime: getRemainingTime(mission[0].time),
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

  async compeleteMission(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const mission = await queryRunner.query(
        this.missionQuery.getWeekMissionQuery(decodeToken.sub),
      );

      await queryRunner.manager.update(
        MissionUser,
        { userId: decodeToken.sub },
        { isSuccess: 'true' },
      );

      await queryRunner.manager.update(
        MissionUser,
        { userId: decodeToken.sub },
        { remainingDate: getRemainingTime(mission[0].time) },
      );

      await queryRunner.manager.update(
        MissionUser,
        { userId: decodeToken.sub },
        { updatedAt: defaultCurrentDateTimes() },
      );

      await queryRunner.manager.update(
        MissionUser,
        { userId: decodeToken.sub },
        { successCount: +1 },
      );

      const experience = new Experience();
      experience.userId = decodeToken.sub;
      experience.value = 15;
      await queryRunner.manager.save(experience);

      const data = {
        id: mission[0].id,
        isSuccess: true,
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

  async createMissionByUserId(accessToken, postMissionRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const mission = new MissionUser();
      mission.missionId = 1;
      mission.userId = decodeToken.sub;
      mission.missionStartDate = defaultCurrentDateTimes();
      mission.missionEndDate = postMissionRequest.missionEndDate;
      const createdMission = await queryRunner.manager.save(mission);

      const data = {
        mission: createdMission,
      };

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      console.log(error);
      // Rollback
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async countLevel(level, userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (level == 6) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 2 },
        );
        const characterLevel = await this.cuRepository.findOne({
          where: { userId: userId },
        });
        if (characterLevel.characterId == 1) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 2 },
          );
        } else if (characterLevel.characterId == 6) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 7 },
          );
        } else if (characterLevel.characterId == 11) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 12 },
          );
        }
      } else if (level == 11) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 3 },
        );
        const characterLevel = await this.cuRepository.findOne({
          where: { userId: userId },
        });
        if (characterLevel.characterId == 2) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 3 },
          );
        } else if (characterLevel.characterId == 7) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 8 },
          );
        } else if (characterLevel.characterId == 12) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 13 },
          );
        }
      } else if (level == 16) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 4 },
        );

        const characterLevel = await this.cuRepository.findOne({
          where: { userId: userId },
        });

        if (characterLevel.characterId == 3) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 4 },
          );
        } else if (characterLevel.characterId == 8) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 9 },
          );
        } else if (characterLevel.characterId == 13) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 14 },
          );
        }
      } else if (level == 21) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 5 },
        );

        const characterLevel = await this.cuRepository.findOne({
          where: { userId: userId },
        });

        if (characterLevel.characterId == 4) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 5 },
          );
        } else if (characterLevel.characterId == 9) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 10 },
          );
        } else if (characterLevel.characterId == 14) {
          await queryRunner.manager.update(
            CharacterUser,
            { userId: userId },
            { characterId: 15 },
          );
        }
      }
      // Commit
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
