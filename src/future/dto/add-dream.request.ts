import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddDreamRequest {
  @ApiProperty({
    example: '당당하고 힘찬 사람',
    description: '상상해보기 제목',
    required: true,
  })
  @IsString()
  subject: string;

  @ApiProperty({
    example: '당당하고 힘찬 사람으로 다시태어나기',
    description: '상상해보기 목적',
    required: true,
  })
  @IsString()
  purpose: string;

  @ApiProperty({
    example: '#0000',
    description: '컬러',
    required: true,
  })
  @IsString()
  color: string;
}
