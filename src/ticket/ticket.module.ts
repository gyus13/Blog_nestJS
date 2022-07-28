import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entity/ticket.entity';
import { TouchCount } from '../entity/touch-count.entity';
import { TicketQuery } from './ticket.query';
import { CharacterUser } from '../entity/character-user.entity';
import { MissionUser } from '../entity/mission-user.entity';
import { MissionService } from '../mission/mission.service';
import {MissionQuery} from "../mission/mission.query";
import {MissionModule} from "../mission/mission.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TouchCount, CharacterUser, MissionUser]),
    MissionModule,
  ],
  providers: [TicketService, TicketQuery, MissionService, MissionQuery],
  controllers: [TicketController],
})
export class TicketModule {}
