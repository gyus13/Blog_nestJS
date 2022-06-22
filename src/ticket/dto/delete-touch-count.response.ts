import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class DeleteTouchCountResponseData {
  @ApiProperty({
    example: '1',
    description: '티켓 인덱스',
    required: true,
  })
  @IsString()
  ticketId: string;
}

export abstract class DeleteTouchCountResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: DeleteTouchCountResponseData;
}
