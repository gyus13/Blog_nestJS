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
    try {
      const decodeToken = await decodeJwt(accessToken);

      const future = await getManager()
        .createQueryBuilder(User, 'user')
        .leftJoin(Character, 'character', 'user.id = character.userId')
        .leftJoin(Experience, 'experience', 'experience.userId = user.id')
        .leftJoin(Title, 'title', 'title.userId = user.id')
        .where('user.id In (:userId)', { userId: decodeToken.sub })
        .select(['user.id as id', 'user.subject as subject'])
        .addSelect([
          'sum(experience.value) div 100 as level',
          'right(sum(experience.value),2) as experience',
          'character.characterImageUrl as characterImageUrl',
          'character.characterImageName as characterImageName',
          'user.nickname as nickname',
          'title.title as title',
        ])
        .getRawOne();

      if (future.level == null) {
        future.level = 1;
      } else if (future.level < 1) {
        future.level = 1;
      }
      if (future.experience == null) {
        future.experience = 0;
      }

      const data = {
        id: future.id,
        subject: future.subject,
        title: future.title,
        level: parseInt(future.level),
        experience: parseInt(future.experience),
        characterImageUrl: future.characterImageUrl,
        characterImageName: future.characterImageName,
        nickname: future.nickname,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
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

      console.log(dream);

      const data = {
        dream: dream,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
      await queryRunner.release();
    } catch (error) {
      return response.ERROR;
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
    }
  }
}
