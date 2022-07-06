import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostInquireRequest {
  @ApiProperty({
    example: '문의내용',
    description: '문의내용',
    required: true,
  })
  @IsString()
  inquiry: string;
}
