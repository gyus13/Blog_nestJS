import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('PurposeUser')
export class Purpose extends CommonEntity {
  @ApiProperty()
  @Column()
  purposeId: number;

  @ApiProperty()
  @Column()
  userId: string;
}
