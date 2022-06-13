import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PatchNicknameRequest {
  @ApiProperty({
    example: 'cookie',
    description: 'nickname',
    required: true,
  })
  @IsString()
  nickname: string;
}
