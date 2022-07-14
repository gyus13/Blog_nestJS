import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Inquiry')
export class Inquiry extends CommonEntity {
  @ApiProperty()
  @Column()
  inquiry: string;

  @ApiProperty()
  @Column()
  userId: number;
}
