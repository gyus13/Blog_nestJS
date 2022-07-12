import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetLogsResponseData {
  @ApiProperty({
    example: '눈치 보지 말고 대화하기',
    description: '제목',
    required: true,
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: '체력도 늘고 활력도 되찾는 나의 모습',
    description: '목적',
    required: true,
  })
  @IsString()
  purpose: string;

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
}

export abstract class GetLogsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetLogsResponseData;
}
