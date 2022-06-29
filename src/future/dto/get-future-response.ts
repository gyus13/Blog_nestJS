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
    example: '이미지 URL',
    description: '내 캐릭터 사진',
    required: true,
  })
  @IsString()
  characterImageUrl: string;

  @ApiProperty({
    example: '꽃봉오리',
    description: '캐릭터 이름',
    required: true,
  })
  @IsString()
  characterName: string;

  @ApiProperty({
    example: '3',
    description: 'level',
    required: true,
  })
  @IsString()
  level: number;
}

export abstract class GetFutureResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetFutureResponseData;
}
