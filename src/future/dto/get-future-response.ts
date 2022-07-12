import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetFutureResponseData {
  @ApiProperty({
    example: '1234',
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
  subject: string;

  @ApiProperty({
    example: '랜선 여행가',
    description: '타이틀',
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
    description: '캐릭터 이미지',
    required: true,
  })
  @IsString()
  characterImageUrl: string;

  @ApiProperty({
    example: '드리밍',
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
