import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/users.entity';
import { Connection, getManager, Repository } from 'typeorm';
import { Inquiry } from '../entity/inquirement.entity';
import { secret } from '../common/secret';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { Ticket } from '../entity/ticket.entity';
import { TouchCount } from '../entity/touch-count.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    private connection: Connection,
  ) {}

  async findUserById(id: string) {
    try {
      const user = await this.usersRepository.findOne({ id });
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  async createInquiry(postInquiryRequest, accessToken) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const inquiry = new Inquiry();
      inquiry.userId = decodeToken.sub;
      inquiry.inquiry = postInquiryRequest.inquiry;

      const createInquiry = await this.inquiryRepository.save(inquiry);

      const data = {
        id: createInquiry.id,
        userId: decodeToken.sub,
        inquiry: postInquiryRequest.inquiry,
      };
      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async retrieveLogs(accessToken) {
    try {
      const decodeToken = await decodeJwt(accessToken);
      const ticketCount = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.userId In (:userId)', { userId: decodeToken.sub })
        .having('isSuccess In (:isSuccess)', { isSuccess: 'Success' })
        .groupBy('ticket.id')
        .select('COUNT(count.id) AS ticketCount')
        .getRawOne();

      const futureCount = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.userId In (:userId)', { userId: decodeToken.sub })
        .having('isSuccess In (:isSuccess)', { isSuccess: 'Success' })
        .groupBy('ticket.id')
        .select('COUNT(count.id) AS ticketCount')
        .getRawOne();

      const missionCount = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.userId In (:userId)', { userId: decodeToken.sub })
        .having('isSuccess In (:isSuccess)', { isSuccess: 'Success' })
        .groupBy('ticket.id')
        .select('COUNT(count.id) AS ticketCount')
        .getRawOne();

      const data = {
        id: decodeToken.sub,
        ticketCount,
        futureCount,
        missionCount,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
