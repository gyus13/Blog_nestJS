import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.entity";

@Entity()
export class Ticket extends CommonEntity {
  @ApiProperty({
    example: '티켓이름',
    description: '티켓명',
    required: true,
  })
  @Column()
  @IsString()
  title: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  start: string;

  @ApiProperty()
  @Column()
  @IsString()
  end: string;

  @ApiProperty()
  @Column()
  @IsString()
  color: string;

  @ApiProperty()
  @Column()
  @IsString()
  category: string;

  @ApiProperty()
  @Column()
  @IsString()
  isSuccess: string;

  @ManyToOne(() => User, (user) => user.ticket)
  user: User;
}
