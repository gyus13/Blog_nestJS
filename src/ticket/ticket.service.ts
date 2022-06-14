import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { AddTicketRequest } from './dto/add-ticket.request';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { query } from 'express';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private connection: Connection,
  ) {}

  async createTicket(addTicket: AddTicketRequest, accessToken) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      console.log(addTicket);
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

  async getTicket(req, accessToken) {
    try {
      const decodeToken = await decodeJwt(accessToken);
      console.log(decodeToken.sub);
      const ticket = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .where('userId In (:userId)', { userId: decodeToken.sub })
        .select([
          'ticket.id',
          'ticket.title',
          'ticket.category',
          'ticket.start',
          'ticket.end',
          'ticket.color',
          'ticket.touchCount',
        ])
        .getMany();

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
