import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { Ticket } from '../entity/ticket.entity';
import { AddTicketRequest } from './dto/add-ticket.request';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { TouchCount } from '../entity/touch-count.entity';
import { User } from '../entity/users.entity';
import { Experience } from 'src/entity/experience.entity';
import { TicketQuery } from './ticket.query';
import { FutureService } from '../future/future.service';
import { TitleUser } from '../entity/title-user.entity';
import { CharacterUser } from '../entity/character-user.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TouchCount)
    private touchCountRepository: Repository<TouchCount>,
    private connection: Connection,
    private ticketQuery: TicketQuery,
    @InjectRepository(CharacterUser)
    private cuRepository: Repository<CharacterUser>,
  ) {}

  async createTicket(addTicket: AddTicketRequest, accessToken) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const ticketCount = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .select('ticket.id')
        .where('ticket.isSuccess IN (:isSuccess)', { isSuccess: 'NotSuccess' })
        .andWhere('userId IN (:userId)', { userId: decodeToken.sub })
        .getMany();

      if (ticketCount.length > 5) {
        return response.NOT_SIX_TICKET;
      }

      // Ticket 인스턴스 생성 후 정보 담기
      const ticket = new Ticket();
      ticket.subject = addTicket.subject;
      ticket.purpose = addTicket.purpose;
      ticket.color = addTicket.color;
      ticket.category = addTicket.category;
      ticket.touchCount = addTicket.touchCount;
      ticket.userId = decodeToken.sub;
      const createTicketData = await queryRunner.manager.save(ticket);

      const data = {
        id: createTicketData.id,
        subject: createTicketData.subject,
        purpose: createTicketData.purpose,
        color: createTicketData.color,
        category: createTicketData.category,
        touchCount: createTicketData.touchCount,
        userId: createTicketData.userId,
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

  async touchTicket(accessToken, ticketId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId, status: 'ACTIVE' },
      });

      // TouchTicket 인스턴스 생성 후 정보 담기
      const touchCount = new TouchCount();
      touchCount.ticketId = ticketId;
      const createTouchTicketData = await queryRunner.manager.save(touchCount);

      // 해당 유저의 해당티켓 터치횟수
      const countResult = await getManager()
        .createQueryBuilder(TouchCount, 'touchCount')
        .select('touchCount.id')
        .andWhere('ticketId IN (:ticketId)', { ticketId: ticketId })
        .getMany();

      const counting = countResult.length;

      if (ticket.touchCount < counting + 1) {
        await queryRunner.manager.update(
          Ticket,
          { id: ticketId },
          { isSuccess: 'Success' },
        );

        const experience = new Experience();
        experience.userId = decodeToken.sub;
        experience.value = 20;
        await queryRunner.manager.save(experience);
      }

      // const experience = await queryRunner.query(
      //   this.ticketQuery.getFutureExperienceQuery(decodeToken.sub),
      // );
      //
      // await this.countLevel(experience[0].level, decodeToken.sub);

      const data = {
        touchCountId: createTouchTicketData.id,
        ticketId: createTouchTicketData.ticketId,
      };
      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async patchTicket(accessToken, ticketId, patchTicketRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId, status: 'ACTIVE' },
      });

      await getConnection()
        .createQueryBuilder()
        .update(Ticket)
        .set({
          subject: patchTicketRequest.subject,
          purpose: patchTicketRequest.purpose,
          color: patchTicketRequest.color,
          category: patchTicketRequest.category,
          touchCount: patchTicketRequest.touchCount,
          userId: decodeToken.sub,
        })
        .where('id = :id', { id: ticketId })
        .execute();

      const data = {
        id: ticket.id,
        subject: patchTicketRequest.subject,
        purpose: patchTicketRequest.purpose,
        color: patchTicketRequest.color,
        category: patchTicketRequest.category,
        touchCount: patchTicketRequest.touchCount,
        userId: decodeToken.sub,
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

  async deleteTicket(accessToken, ticketId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId, status: 'ACTIVE' },
      });

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Ticket)
        .where('id = :id', { id: ticketId })
        .execute();

      const data = {
        ticketId: ticket.id,
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

  async deleteTouchTicket(accessToken, ticketId) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const entityManager = getManager();
      await entityManager.query(
        `
        DELETE
        from TouchCount
        where ticketId= ` +
          ticketId +
          `
        order by createdAt desc
        limit 1;
        `,
      );

      const data = {
        ticketId: ticketId,
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

  async getTicket(req, accessToken) {
    try {
      const decodeToken = await decodeJwt(accessToken);
      const ticket = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .leftJoin(TouchCount, 'count', 'count.ticketId = ticket.id')
        .leftJoin(User, 'user', 'user.id = ticket.userId')
        .where('ticket.userId In (:userId)', { userId: decodeToken.sub })
        .having('isSuccess In (:isSuccess)', { isSuccess: 'NotSuccess' })
        .groupBy('ticket.id')
        .select([
          'ticket.id as id',
          'ticket.category as category',
          'ticket.subject as subject',
          'ticket.purpose as purpose',
          'ticket.color as color',
          'ticket.touchCount as touchCount',
          'ticket.isSuccess as isSuccess',
        ])
        .addSelect('COUNT(count.id) AS currentCount')
        .getRawMany();

      const data = {
        ticket: ticket,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async getRecommendTicket(req, id) {
    try {
      const ticket = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.userId In (:userId)', { userId: id })
        .select([
          'ticket.id as id',
          'ticket.category as category',
          'ticket.subject as subject',
          'ticket.purpose as purpose',
          'ticket.color as color',
          'ticket.touchCount as touchCount',
          'ticket.isSuccess as isSuccess',
        ])
        .limit(1)
        .getRawMany();

      const data = {
        ticket: ticket,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async getOtherTicket(req) {
    try {
      const ticket = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .select([
          'ticket.id as id',
          'ticket.category as category',
          'ticket.subject as subject',
          'ticket.purpose as purpose',
          'ticket.color as color',
        ])
        .andWhere('ticket.isSuccess IN (:isSuccess)', { isSuccess: 'Success' })
        .limit(3)
        .getRawMany();

      const data = {
        ticket: ticket,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
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
        console.log('1')
        const characterLevel = await this.cuRepository.findOne({
          where: { id: userId },
        });
      console.log('2')
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
