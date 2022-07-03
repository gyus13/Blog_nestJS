import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Character')
export class Character extends CommonEntity {
  @ApiProperty()
  @Column()
  characterImageUrl: string;

  @ApiProperty()
  @Column()
  characterImageName: string;

  @ApiProperty()
  @Column()
  characterImageDescription: string;
}
