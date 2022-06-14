import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { BaseResponse } from '../../config/base.response';

class SignInResponseData {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOjEsImlhdCI6MTY1NTE2MTYzNCwiZXhwIjoxNjg2NzE5MjM0fQ.go4zOhwNGjNsL9-7G3jfVbbIWgICq1aYw6SBJSFKIQ0',
    description: 'nickname',
    required: true,
  })
  @IsString()
  jwtToken: string;
}

export abstract class SignInResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  @IsArray()
  result: SignInResponseData;
}
