import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetMissionLogsResponseData {
  @ApiProperty({
    example: 1,
    description: '목적',
    required: true,
  })
  @IsString()
  id: number;

  @ApiProperty({
    example: '스와이프 6번 하기',
    description: '미션',
    required: true,
  })
  @IsString()
  mission: string;
}

export abstract class GetMissionLogsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetMissionLogsResponseData;
}
