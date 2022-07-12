import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Title')
export class Title extends CommonEntity {
  @ApiProperty()
  @Column()
  title: string;
}
