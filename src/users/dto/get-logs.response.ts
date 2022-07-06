import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetLogsResponseData {
  @ApiProperty({
    example: '1045203450',
    description: 'userId',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: '5',
    description: '티켓수',
    required: true,
  })
  @IsString()
  ticketCount: number;

  @ApiProperty({
    example: '2',
    description: '미션수',
    required: true,
  })
  @IsString()
  missionCount: number;

  @ApiProperty({
    example: '3',
    description: '미래의나 수',
    required: true,
  })
  @IsString()
  futureCount: number;
}

export abstract class GetLogsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetLogsResponseData;
}
