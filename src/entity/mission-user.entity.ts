import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('MissionUser')
export class MissionUser extends CommonEntity {
  @ApiProperty()
  @Column()
  missionId: number;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  isSuccess: string;

  @ApiProperty()
  @Column()
  missionEndDate: string;

  @ApiProperty()
  @Column()
  missionStartDate: string;

  @ApiProperty()
  @Column()
  remainingDate: string;

  @ApiProperty()
  @Column()
  successCount: number;
}
