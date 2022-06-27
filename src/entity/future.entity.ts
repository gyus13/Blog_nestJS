import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Future')
export class Future extends CommonEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  userId: string;
}
