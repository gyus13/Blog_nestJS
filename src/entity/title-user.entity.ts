import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('TitleUser')
export class TitleUser extends CommonEntity {
  @ApiProperty()
  @Column()
  titleId: number;

  @ApiProperty()
  @Column()
  userId: number;
}
