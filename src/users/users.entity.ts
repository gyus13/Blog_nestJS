import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Ticket} from "../ticket/ticket.entity";

@Entity()
export class User extends CommonEntity {
  @ApiProperty({
    example: 'gyus',
    description: 'nickname',
    required: true,
  })
  @Column()
  @IsString()
  nickname: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.user)
  ticket: Ticket[];
}
