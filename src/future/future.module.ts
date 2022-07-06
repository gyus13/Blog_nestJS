import { Module } from '@nestjs/common';
import { FutureController } from './future.controller';
import { FutureService } from './future.service';
import {FutureQuery} from "./future.query";

@Module({
  controllers: [FutureController],
  providers: [FutureService, FutureQuery],
})
export class FutureModule {}
