import { User } from '../users.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UsersCreateDto extends PickType(User, ['nickname'] as const) {}
