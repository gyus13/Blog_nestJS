import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';
class GetDreamLogsResponseData {
  @ApiProperty({
    example: 1,
    description: '상상해보기 인덱스',
    required: true,
  })
  id: number;

  // @ApiProperty({
  //   example: 1203102300,
  //   description: 'userId',
  //   required: true,
  // })
  // @IsString()
  // userId: string;

  @ApiProperty({
    example: '당당하고 멋있는 사람',
    description: '제목',
    required: true,
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: '사람들 앞에서 당당해지기',
    description: '목표',
    required: true,
  })
  @IsString()
  purpose: string;

  @ApiProperty({
    example: '#00000',
    description: '컬러',
    required: true,
  })
  @IsString()
  color: string;
}

export abstract class GetDreamLogsResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: GetDreamLogsResponseData;
}
