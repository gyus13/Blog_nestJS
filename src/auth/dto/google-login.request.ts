import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GoogleLoginRequest {
  @ApiProperty({
    example: 'x123123dfasda',
    description: 'idToken',
    required: true,
  })
  @IsString()
  token: string;
}
