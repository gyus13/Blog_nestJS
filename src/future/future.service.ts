import { Injectable } from '@nestjs/common';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { getConnection, getManager } from 'typeorm';
import { Connection } from 'typeorm';
import { User } from '../entity/users.entity';
import { response } from '../config/response.utils';
import { Character } from '../entity/character.entity';
import { Experience } from '../entity/experience.entity';
import { Title } from '../entity/title.entity';
import { Dream } from '../entity/dream.entity';
import { FutureQuery } from './future.query';

@Injectable()
export class FutureService {
  constructor(
    private connection: Connection,
    private futureQuery: FutureQuery,
  ) {}

  async retrieveFuture(req, accessToken) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const title = await queryRunner.query(
        this.futureQuery.getFutureTitleQuery(decodeToken.sub),
      );

      const experience = await queryRunner.query(
        this.futureQuery.getFutureExperienceQuery(decodeToken.sub),
      );

      const character = await queryRunner.query(
        this.futureQuery.getFutureCharacterQuery(decodeToken.sub),
      );

      if (experience[0].level == null) {
        experience[0].level = 1;
      } else if (experience[0].level < 1) {
        experience[0].level = 1;
      }
      if (experience[0].experience == null) {
        experience[0].experience = 0;
      }

      const data = {
        id: character[0].id,
        subject: character[0].subject,
        title: title[0].title,
        level: parseInt(experience[0].level),
        experience: parseInt(experience[0].experience),
        characterImageUrl: character[0].characterImageUrl,
        nickname: character[0].nickname,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async createFutureTitle(req, accessToken, patchFutureRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      await queryRunner.manager.update(
        User,
        { id: decodeToken.sub },
        { subject: patchFutureRequest.subject },
      );

      const data = {
        id: decodeToken.sub,
        subject: patchFutureRequest.subject,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveDream(req, accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      // 상상해보기 조회
      const dream = await queryRunner.query(
        this.futureQuery.getDreamQuery(decodeToken.sub),
      );

      const data = {
        dream: dream,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
  async createDream(req, accessToken, addDreamRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const dreamCount = await getManager()
        .createQueryBuilder(Dream, 'dream')
        .select('dream.id')
        .where('dream.isSuccess IN (:isSuccess)', { isSuccess: false })
        .andWhere('userId IN (:userId)', { userId: decodeToken.sub })
        .getMany();

      if (dreamCount.length > 5) {
        return response.NOT_SIX_DREAM;
      }

      // Ticket 인스턴스 생성 후 정보 담기
      const dream = new Dream();
      dream.subject = addDreamRequest.subject;
      dream.purpose = addDreamRequest.purpose;
      dream.color = addDreamRequest.color;
      dream.userId = decodeToken.sub;
      const createDreamData = await queryRunner.manager.save(dream);

      const data = {
        id: createDreamData.id,
        subject: createDreamData.subject,
        purpose: createDreamData.purpose,
        color: createDreamData.color,
        isSuccess: 0,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async editDream(accessToken, id, addDreamRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      await queryRunner.manager.update(
        Dream,
        { id: id },
        { subject: addDreamRequest.subject },
      );

      await queryRunner.manager.update(
        Dream,
        { id: id },
        { purpose: addDreamRequest.purpose },
      );

      await queryRunner.manager.update(
        Dream,
        { id: id },
        { color: addDreamRequest.color },
      );

      const data = {
        id: parseInt(id),
        subject: addDreamRequest.subject,
        purpose: addDreamRequest.purpose,
        color: addDreamRequest.color,
        isSuccess: 0,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteDream(accessToken, id) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      await queryRunner.manager.delete(Dream, { id: id });

      const data = {
        id: parseInt(id),
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async touchDream(accessToken, dreamId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      await queryRunner.manager.update(
        Dream,
        { id: dreamId },
        { isSuccess: true },
      );

      const experience = new Experience();
      experience.userId = decodeToken.sub;
      experience.value = 15;
      await queryRunner.manager.save(experience);

      const data = {
        id: parseInt(dreamId),
        isSuccess: 1,
      };
      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
