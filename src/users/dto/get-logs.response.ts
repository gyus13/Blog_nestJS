import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetLogsResponseData {
  @ApiProperty({
    example: 2,
    description: '카운트',
    required: true,
  })
  @IsString()
  dreamCount: number;

  @ApiProperty({
    example: 3,
    description: '카운트',
    required: true,
  })
  @IsString()
  ticketCount: number;

  @ApiProperty({
    example: 1,
    description: '카운트',
    required: true,
  })
  @IsString()
  missionCount: number;
}

export abstract class GetLogsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetLogsResponseData;
}
