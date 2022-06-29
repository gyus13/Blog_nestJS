import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class AddFutureTitleResponseData {
  @ApiProperty({
    example: '1',
    description: '미래의 나 인덱스',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: '당당하고 멋있는 사람',
    description: '제목',
    required: true,
  })
  @IsString()
  title: string;
}

export abstract class AddFutureTitleResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: AddFutureTitleResponseData;
}
