import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('CharacterUser')
export class CharacterUser extends CommonEntity {
  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  characterId: number;
}
