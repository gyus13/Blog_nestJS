import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common/common.entity';

@Entity()
export class User extends CommonEntity {
  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
