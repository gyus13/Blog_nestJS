import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

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
}
