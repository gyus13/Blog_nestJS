import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Experience')
export class Experience extends CommonEntity {
  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  value: number;
}
