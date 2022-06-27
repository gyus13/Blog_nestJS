import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export abstract class CommonEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 열이 추가된 시각을 자동으로 기록
  // 만일 Postgres의 time zone이 'UTC'라면 UTC 기준으로 출력하고 'Asia/Seoul'라면 서울 기준으로 출력한다.
  // DB SQL QUERY : set time zone 'Asia/Seoul'; set time zone 'UTC'; show timezone;
  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @Column({ default: 'ACTIVE' })
  status: string;
}
