import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { MissionQuery } from './mission.query';
import { PushService } from '../push/push.service';

@Module({
  imports: [PushService],
  providers: [MissionService, MissionQuery, PushService],
  controllers: [MissionController],
})
export class MissionModule {}
