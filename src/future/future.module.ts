import { Module } from '@nestjs/common';
import { FutureController } from './future.controller';
import { FutureService } from './future.service';
import { FutureQuery } from './future.query';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entity/ticket.entity';
import { TouchCount } from '../entity/touch-count.entity';
import { CharacterUser } from '../entity/character-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterUser])],
  controllers: [FutureController],
  providers: [FutureService, FutureQuery],
  exports: [FutureService],
})
export class FutureModule {}
