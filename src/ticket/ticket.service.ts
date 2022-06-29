import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { Ticket } from '../entity/ticket.entity';
import { AddTicketRequest } from './dto/add-ticket.request';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { query } from 'express';
import { TouchCount } from '../entity/touch-count.entity';
import { TouchTicket } from '../common/decorators/ticket.decorator';
import { User } from '../entity/users.entity';
import { Experience } from 'src/entity/experience.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TouchCount)
    private touchCountRepository: Repository<TouchCount>,
    private connection: Connection,
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
      ticket.title = addTicket.title;
      ticket.start = addTicket.start;
      ticket.end = addTicket.end;
      ticket.color = addTicket.color;
      ticket.category = addTicket.category;
      ticket.touchCount = addTicket.touchCount;
      ticket.userId = decodeToken.sub;
      const createTicketData = await queryRunner.manager.save(ticket);

      const data = {
        id: createTicketData.id,
        title: createTicketData.title,
        start: createTicketData.start,
        end: createTicketData.end,
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

      if (ticket.touchCount < counting) {
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
      await queryRunner.release();
      return response.ERROR;
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
          title: patchTicketRequest.title,
          start: patchTicketRequest.start,
          end: patchTicketRequest.end,
          color: patchTicketRequest.color,
          category: patchTicketRequest.category,
          touchCount: patchTicketRequest.touchCount,
          userId: decodeToken.sub,
        })
        .where('id = :id', { id: ticketId })
        .execute();

      const data = {
        id: ticket.id,
        title: patchTicketRequest.title,
        start: patchTicketRequest.start,
        end: patchTicketRequest.end,
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
          'ticket.title as title',
          'ticket.category as category',
          'ticket.start as start',
          'ticket.end as end',
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
          'ticket.title as title',
          'ticket.category as category',
          'ticket.start as start',
          'ticket.end as end',
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
          'ticket.title as title',
          'ticket.category as category',
          'ticket.start as start',
          'ticket.end as end',
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
}
