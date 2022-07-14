import { Injectable } from '@nestjs/common';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { getConnection, getManager, Repository } from 'typeorm';
import { Connection } from 'typeorm';
import { User } from '../entity/users.entity';
import { response } from '../config/response.utils';
import { Character } from '../entity/character.entity';
import { Experience } from '../entity/experience.entity';
import { Title } from '../entity/title.entity';
import { Dream } from '../entity/dream.entity';
import { FutureQuery } from './future.query';
import { TitleUser } from 'src/entity/title-user.entity';
import { CharacterUser } from '../entity/character-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TouchCount } from '../entity/touch-count.entity';

@Injectable()
export class FutureService {
  constructor(
    private connection: Connection,
    private futureQuery: FutureQuery,
    @InjectRepository(CharacterUser)
    private cuRepository: Repository<CharacterUser>,
  ) {}

  async retrieveFuture(req, accessToken) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const title = await getManager()
        .createQueryBuilder(User, 'user')
        .leftJoin(TitleUser, 'TU', 'user.id = TU.userId')
        .leftJoin(Title, 'title', 'title.id = TU.titleId')
        .addSelect('title.title as title')
        .where('TU.userId IN (:userId)', { userId: decodeToken.sub })
        .getRawOne();
      console.log(title);

      const experience = await getManager()
        .createQueryBuilder(User, 'user')
        .leftJoin(Experience, 'experience', 'experience.userId = user.id')
        .addSelect('sum(experience.value) div 100 as level')
        .addSelect('right(sum(experience.value),2) as experience')
        .where('experience.userId IN (:userId)', { userId: decodeToken.sub })
        .getRawOne();
      console.log(experience);

      const character = await getManager()
        .createQueryBuilder(User, 'user')
        .leftJoin(CharacterUser, 'CU', 'CU.userId = user.id')
        .leftJoin(Character, 'character', 'character.id = CU.characterId')
        .select([
          'user.id as id',
          'user.nickname as nickname',
          'user.subject as subject',
        ])
        .addSelect('character.characterImageUrl as characterImageUrl')
        .where('CU.userId IN (:userId)', { userId: decodeToken.sub })
        .getRawOne();

      console.log(character.characterImageUrl);

      if (experience.level == null) {
        experience.level = 1;
      } else if (experience.level < 1) {
        experience.level = 1;
      }
      if (experience.experience == null) {
        experience.experience = 0;
      }

      const data = {
        id: character.id,
        subject: character.subject,
        title: title.title,
        level: parseInt(experience.level),
        experience: parseInt(experience.experience),
        characterImageUrl: character.characterImageUrl,
        nickname: character.nickname,
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
      const dream = await getManager()
        .createQueryBuilder(Dream, 'dream')
        .select([
          'dream.id',
          'dream.subject',
          'dream.purpose',
          'dream.color',
          'dream.isSuccess',
        ])
        .where('dream.userId IN (:userId)', { userId: decodeToken.sub })
        .andWhere('dream.isSuccess IN (:isSuccess)', { isSuccess: 0 })
        .getMany();

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

      // const countExperience = await queryRunner.query(
      //   this.futureQuery.getFutureExperienceQuery(decodeToken.sub),
      // );
      //
      // await this.countLevel(countExperience[0].level, decodeToken.sub);

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

  async countLevel(level, userId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (level >= 6 && level <= 10) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 2 },
        );

        const characterLevel = await this.cuRepository.findOne({
          where: { id: userId },
        });

        await queryRunner.manager.update(
          CharacterUser,
          { userId: userId },
          { characterId: characterLevel.characterId + 1 },
        );
      } else if (level >= 11 && level <= 15) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 3 },
        );

        const characterLevel = await this.cuRepository.findOne({
          where: { id: userId },
        });

        await queryRunner.manager.update(
          CharacterUser,
          { userId: userId },
          { characterId: characterLevel.characterId + 1 },
        );
      } else if (level >= 16 && level <= 20) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 4 },
        );

        const characterLevel = await this.cuRepository.findOne({
          where: { id: userId },
        });

        await queryRunner.manager.update(
          CharacterUser,
          { userId: userId },
          { characterId: characterLevel.characterId + 1 },
        );
      } else if (level >= 21 && level <= 25) {
        await queryRunner.manager.update(
          TitleUser,
          { userId: userId },
          { titleId: 5 },
        );

        const characterLevel = await this.cuRepository.findOne({
          where: { id: userId },
        });

        await queryRunner.manager.update(
          CharacterUser,
          { userId: userId },
          { characterId: characterLevel.characterId + 1 },
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
