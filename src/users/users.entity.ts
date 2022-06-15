import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '../ticket/ticket.entity';

@Entity("user")
export class User extends CommonEntity {
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
}
