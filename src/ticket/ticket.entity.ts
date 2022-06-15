import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Entity('Ticket')
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
  touchCount: number;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column({ default: 'NotSuccess' })
  isSuccess: string;

  @ApiProperty()
  @Column({ default: 'NotTouch' })
  isTouched: string;
}
