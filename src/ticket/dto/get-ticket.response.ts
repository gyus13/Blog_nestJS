import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetTicketResponseData {
  @ApiProperty({
    example: '1',
    description: '티켓 인덱스',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: '성장',
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
    example: '#000000',
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
    example: '5',
    description: '터치횟수(5,10,15)',
    required: true,
  })
  @IsString()
  touchCount: number;

  @ApiProperty({
    example: 'NotSuccess',
    description: '티켓 터치카운트 성공 여부',
    required: true,
  })
  @IsString()
  isSuccess: string;

  @ApiProperty({
    example: '6',
    description: '현재 터치 횟수',
    required: true,
  })
  @IsString()
  currentCount: number;
}

export abstract class GetTicketResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetTicketResponseData;
}
