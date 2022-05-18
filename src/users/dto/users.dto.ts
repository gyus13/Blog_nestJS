import { OmitType, PickType } from '@nestjs/swagger';
import { User } from '../users.entity';

export class UserDTO extends PickType(User, [
  'id',
  'email',
  'nickname',
] as const) {}
