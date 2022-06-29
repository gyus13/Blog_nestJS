import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('FutureProfile')
export class FutureProfile extends CommonEntity {
  @ApiProperty()
  @Column()
  profileImageUrl: string;

  @ApiProperty()
  @Column()
  userId: string;
}
