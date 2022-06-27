import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Purpose')
export class Purpose extends CommonEntity {
  @ApiProperty()
  @Column()
  title: string;
}
