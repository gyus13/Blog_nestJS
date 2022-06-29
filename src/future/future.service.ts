import { Injectable } from '@nestjs/common';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { getManager } from 'typeorm';
import { Ticket } from '../entity/ticket.entity';
import { TouchCount } from '../entity/touch-count.entity';
import { User } from '../entity/users.entity';
import { response } from '../config/response.utils';
import { Future } from 'src/entity/future.entity';

@Injectable()
export class FutureService {
  constructor() {}

  async retrieveFuture(req, accessToken) {
    try {
      const decodeToken = await decodeJwt(accessToken);
      const future = await getManager()
        .createQueryBuilder(Future, 'future')
        .where('future.userId In (:userId)', { userId: decodeToken.sub })
        .select(['future.id', 'future.title'])
        .getOne();

      const data = {
        future
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }
}
