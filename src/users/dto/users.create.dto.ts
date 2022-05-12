import { User } from '../users.entity';
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsersCreateDto extends PickType(User, [
  'email',
  'nickname',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해 주세요' })
  password: string;
}
