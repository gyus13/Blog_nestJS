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
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { Inquiry } from '../entity/inquirement.entity';
import { secret } from '../common/secret';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { Ticket } from '../entity/ticket.entity';
import { TouchCount } from '../entity/touch-count.entity';
import { UsersQuery } from './users.query';
import { Category } from '../config/variable.utils';
import {Dream} from "../entity/dream.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    private connection: Connection,
    private userQuery: UsersQuery,
  ) {}

  // async findUserById(id: string) {
  //   try {
  //     const user = await this.usersRepository.findOne({ id });
  //     if (!user) throw new Error();
  //     return user;
  //   } catch (error) {
  //     throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
  //   }
  // }

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

  async retrieveTicketLogs(accessToken, request) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const queryResult = await getManager()
        .createQueryBuilder(Ticket, 'ticket')
        .where('ticket.userId In (:userId)', { userId: decodeToken.sub })
        .andWhere('ticket.isSuccess In (:isSuccess)', { isSuccess: 'Success' });

      if (request.query.category == Category.HEALTH) {
        await queryResult.andWhere('ticket.category IN (:category)', {
          category: Category.HEALTH,
        });
      } else if (request.query.category == Category.MIND) {
        await queryResult.andWhere('ticket.category IN (:category)', {
          category: Category.MIND,
        });
      } else if (request.query.category == Category.RELATIONSHIP) {
        await queryResult.andWhere('ticket.category IN (:category)', {
          category: Category.RELATIONSHIP,
        });
      } else if (request.query.category == Category.DEVELOPMENT) {
        await queryResult.andWhere('ticket.category IN (:category)', {
          category: Category.DEVELOPMENT,
        });
      } else if (request.query.category == Category.PERSONALITY) {
        await queryResult.andWhere('ticket.category IN (:category)', {
          category: Category.PERSONALITY,
        });
      }

      const ticket = await queryResult
        .select([
          'ticket.id as id',
          'ticket.subject as subject',
          'ticket.purpose as purpose',
          'ticket.color as color',
          'ticket.category as category',
          'ticket.touchCount as touchCount',
        ])
        .getRawMany();

      const data = {
        ticket: ticket,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveMainLogs(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const user = await this.usersRepository.findOne({
        where: { id: decodeToken.sub },
      });

      const countingDream = await queryRunner.query(
        this.userQuery.getDreamCountLogsQuery(decodeToken.sub),
      );

      const countingTicket = await queryRunner.query(
        this.userQuery.getTicketCountLogsQuery(decodeToken.sub),
      );

      const countingMission = await queryRunner.query(
        this.userQuery.getMissionCountLogsQuery(decodeToken.sub),
      );

      const countingTicketTouch = await queryRunner.query(
        this.userQuery.getTicketTouchCountLogsQuery(decodeToken.sub),
      );

      const data = {
        dreamCount: countingDream.length,
        ticketCount: countingTicket.length,
        missionCount: countingMission.length,
        ticketTouchCount: countingTicketTouch.length,
        nickname: user.nickname,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveMissionLogs(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const mission = await queryRunner.query(
        this.userQuery.getMissionQuery(decodeToken.sub),
      );

      const data = {
        mission: mission,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveDreamLogs(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const dream = await queryRunner.query(
        this.userQuery.getDreamQuery(decodeToken.sub),
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

  async retrieveMission(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      const mission = await queryRunner.query(
        this.userQuery.getWeekMissionQuery(decodeToken.sub),
      );

      const data = {
        mission: mission,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveEmail(accessToken) {
    const queryRunner = getConnection().createQueryRunner();
    try {
      const decodeToken = await decodeJwt(accessToken);

      console.log(decodeToken)
      const user = await this.usersRepository.findOne({
        where: { id: decodeToken.sub },
      });
      console.log(user)
      const data = {
        email: user.email,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
