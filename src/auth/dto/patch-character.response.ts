import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';

class PatchCharacterResponseData {
  @ApiProperty({
    example:
      'https://raw.githubusercontent.com/gyus13/EndTicket_Image/main/%EA%BD%831.png',
    description: 'characterUrl',
    required: true,
  })
  @IsString()
  characterUrl: string;
}

export abstract class PatchCharacterResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: PatchCharacterResponseData;
}
