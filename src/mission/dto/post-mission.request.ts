import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostMissionRequest {
  @ApiProperty({
    example: '2022-07-24 07:06:00',
    description: '날짜',
    required: true,
  })
  @IsString()
  missionEndDate: string;
}
