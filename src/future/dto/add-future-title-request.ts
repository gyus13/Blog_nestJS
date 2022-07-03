import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddFutureTitleRequest {
  @ApiProperty({
    example: '당당하고 힘찬 사',
    description: '람래의 나 설명',
    required: true,
  })
  @IsString()
  subject: string;
}
