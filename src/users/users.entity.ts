import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';

@Entity()
export class User extends CommonEntity {
  @Column()
  @IsString()
  nickname: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;
}
