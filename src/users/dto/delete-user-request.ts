import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteUserRequest {
  @ApiProperty({
    example: '탈퇴할래요',
    description: '탈퇴이유',
    required: true,
  })
  @IsString()
  text: string;
}
