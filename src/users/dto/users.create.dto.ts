import { User } from '../users.entity';
import {ApiProperty, PickType} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsersCreateDto extends PickType(User, ['email'] as const) {
  @ApiProperty()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;
}
