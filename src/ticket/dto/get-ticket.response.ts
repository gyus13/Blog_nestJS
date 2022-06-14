import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetTicketResponseData {
  @ApiProperty({
    example: 'cookie',
    description: 'nickname',
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
    example: 'Yellow',
    description: '색상',
    required: true,
  })
  @IsString()
  color: string;
}

export abstract class GetTicketResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetTicketResponseData;
}
