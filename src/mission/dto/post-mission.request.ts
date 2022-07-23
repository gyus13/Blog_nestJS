import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostMissionRequest {
  @ApiProperty({
    example: '2022-07-19 07:09:20',
    description: '날짜',
    required: true,
  })
  @IsString()
  missionStartDate: string;

  @ApiProperty({
    example: '2022-07-24 07:09:20',
    description: '날짜',
    required: true,
  })
  @IsString()
  missionEndDate: string;
}
