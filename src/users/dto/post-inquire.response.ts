import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class PostInquireResponseData {
  @ApiProperty({
    example: '1',
    description: '문의 인덱스',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: '문의내용',
    description: '문의하기',
    required: true,
  })
  @IsString()
  inquiry: string;

  @ApiProperty({
    example: '1045203450',
    description: 'userId',
    required: true,
  })
  @IsString()
  userId: string;
}

export abstract class PostInquireResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: PostInquireResponseData;
}
