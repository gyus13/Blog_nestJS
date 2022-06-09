import { User } from '../users.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UsersNicknameDto extends PickType(User, ['nickname'] as const) {}
