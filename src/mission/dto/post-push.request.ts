import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostPushRequest {
  @ApiProperty({
    example: 'token',
    description: 'token',
    required: true,
  })
  @IsString()
  token: string;
}
