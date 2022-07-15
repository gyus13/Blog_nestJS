import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostEmailRequest {
  @ApiProperty({
    example: 'email@email.com',
    description: '이메일',
    required: true,
  })
  @IsString()
  email: string;
}
