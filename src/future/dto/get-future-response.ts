import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetFutureResponseData {
  @ApiProperty({
    example: '1',
    description: '미래의 나 인덱스',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: '당당하고 멋있는 사람',
    description: '제목',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '3',
    description: 'level',
    required: true,
  })
  @IsString()
  level: string;

  @ApiProperty({
    example: '20',
    description: '경험치',
    required: true,
  })
  @IsString()
  experience: string;

  @ApiProperty({
    example: '이미지 URL',
    description: '프로필 이미지',
    required: true,
  })
  @IsString()
  profileImageUrl: string;

  @ApiProperty({
    example: '꽃봉오리',
    description: '닉네임',
    required: true,
  })
  @IsString()
  nickname: string;


}

export abstract class GetFutureResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetFutureResponseData;
}
