import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
    required: true,
  })
  @IsString()
  email: string;
}
