import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { FutureModule } from './future/future.module';

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
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TicketModule,
    FutureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
