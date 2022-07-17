import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron('0 0 7 * * 1')
  handleCron() {
    console.log('hello');
  }
}
