import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class TouchTicketResponseData {
  @ApiProperty({
    example: '1',
    description: '티켓 인덱스',
    required: true,
  })
  @IsString()
  ticketId: string;

  @ApiProperty({
    example: '1',
    description: '유저 인덱스',
    required: true,
  })
  @IsString()
  userId: string;
}

export abstract class TouchTicketResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: TouchTicketResponseData;
}
