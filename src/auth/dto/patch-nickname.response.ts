import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';

class PatchNicknameResponseData {
  @ApiProperty({
    example: 'cookie',
    description: 'nickname',
    required: true,
  })
  @IsString()
  nickname: string;
}

export abstract class PatchNicknameResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: PatchNicknameResponseData;
}