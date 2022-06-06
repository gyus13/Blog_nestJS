import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends CommonEntity {
  @ApiProperty({
    example: 'gyus',
    description: 'nickname',
    required: true,
  })
  @Column()
  @IsString()
  nickname: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  password: string;
}
