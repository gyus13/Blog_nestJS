import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class touchDreamResponseData {
  @ApiProperty({
    example: '1',
    description: 'dream 인덱스',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: 0,
    description: '성취 여부(true:1, false:0)',
    required: true,
  })
  @IsString()
  isSuccess: boolean;
}

export abstract class TouchDreamResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: touchDreamResponseData;
}
