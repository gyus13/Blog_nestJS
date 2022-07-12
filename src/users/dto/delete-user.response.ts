import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class DeleteUserResponseData {
  @ApiProperty({
    example: '1232452364637',
    description: '인덱스',
    required: true,
  })
  id: string;
}

export abstract class DeleteUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: DeleteUserResponseData;
}
