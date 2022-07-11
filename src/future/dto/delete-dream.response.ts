import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class DeleteDreamResponseData {
  @ApiProperty({
    example: 1,
    description: '인덱스',
    required: true,
  })
  id: number;
}

export abstract class DeleteDreamResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: DeleteDreamResponseData;
}
