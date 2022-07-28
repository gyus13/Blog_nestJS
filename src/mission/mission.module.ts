import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { MissionQuery } from './mission.query';
import { PushService } from '../push/push.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/users.entity';
import { Inquiry } from '../entity/inquirement.entity';
import { MissionUser } from '../entity/mission-user.entity';
import { Mission } from '../entity/mission.entity';
import {CharacterUser} from "../entity/character-user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MissionUser, Mission, CharacterUser]), PushService],
  providers: [MissionService, MissionQuery, PushService],
  controllers: [MissionController],
  exports: [MissionService]
})
export class MissionModule {}
