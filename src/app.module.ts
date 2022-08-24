import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { FutureModule } from './future/future.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { PushService } from './push/push.service';
import { PushModule } from './push/push.module';
import { MissionModule } from './mission/mission.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'endticket.c8pzmu4jd1w2.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: '12345678',
      database: 'test',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    TicketModule,
    FutureModule,
    ScheduleModule.forRoot(),
    PushModule,
    MissionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, PushService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
