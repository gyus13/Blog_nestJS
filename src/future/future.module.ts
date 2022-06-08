import { Module } from '@nestjs/common';
import { FutureController } from './future.controller';

@Module({
  controllers: [FutureController]
})
export class FutureModule {}
