import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from './ticket.entity';

@Entity('User')
export class User extends CommonEntity{
  @ApiProperty({
    example: 'gyus',
    description: 'nickname',
  })
  @Column({ nullable: true })
  // @IsString({ message: '문자열로 작성해 주세요' })
  nickname: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  @IsEmail({ message: '이메일 형식으로 작성해 주세요' })
  email: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  @IsString()
  password: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  subject: string;

  @Column({ length: 100 })
  accountId: string;
}
