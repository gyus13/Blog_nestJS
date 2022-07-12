import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PatchCharacterRequest {
  @ApiProperty({
    example: 1,
    description: '1(꽃), 6(냥냥), 11(별)',
    required: true,
  })
  characterId: number;
}
