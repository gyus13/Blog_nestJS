import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Dream')
export class Dream extends CommonEntity {
  @ApiProperty()
  @Column()
  @IsString()
  subject: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  purpose: string;

  @ApiProperty()
  @Column()
  @IsString()
  color: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty()
  @Column({ default: false })
  isSuccess: boolean;
}
