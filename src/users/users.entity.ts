import {Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn} from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import {IsEmail, IsString, IsUUID} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '../ticket/ticket.entity';

@Entity("User")
export class User{
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'gyus',
    description: 'nickname',
  })
  @Column({ nullable: true })
  // @IsString({ message: '문자열로 작성해 주세요' })
  nickname: string;

  @ApiProperty()
  @Column()
  @IsEmail({ message: '이메일 형식으로 작성해 주세요' })
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  password: string;

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
