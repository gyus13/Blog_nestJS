import { Ticket } from '../ticket.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {IsString} from "class-validator";

export class AddTicketRequest {
  @ApiProperty({
    example: '눈치 안보기',
    description: '제목',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '눈치 보지 말고 대화하기',
    description: '시작역',
    required: true,
  })
  @IsString()
  start: string;

  @ApiProperty({
    example: '체력도 늘고 활력도 되찾는 나의 모습',
    description: '종착역',
    required: true,
  })
  @IsString()
  end: string;

  @ApiProperty({
    example: '#00000',
    description: '색상',
    required: true,
  })
  @IsString()
  color: string;

  @ApiProperty({
    example: '운동',
    description: '카테고리',
    required: true,
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: '15',
    description: '터치횟수',
    required: true,
  })
  @IsString()
  touchCount: number;
}
