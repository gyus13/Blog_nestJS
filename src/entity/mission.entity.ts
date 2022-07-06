import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Mission')
export class Mission extends CommonEntity {
  @ApiProperty()
  @Column()
  mission: string;
}
