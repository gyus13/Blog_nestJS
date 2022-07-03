import { Injectable } from '@nestjs/common';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { getConnection, getManager } from 'typeorm';
import { Connection } from 'typeorm';
import { User } from '../entity/users.entity';
import { response } from '../config/response.utils';
import { Character } from '../entity/character.entity';
import { Experience } from '../entity/experience.entity';
import { Title } from '../entity/title.entity';

@Injectable()
export class FutureService {
  constructor(private connection: Connection) {}

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
        future.level = 0;
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
        title: patchFutureRequest.title,
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
