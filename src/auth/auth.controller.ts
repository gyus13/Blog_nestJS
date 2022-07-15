import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { PatchNicknameResponse } from './dto/patch-nickname.response';
import { PatchNicknameRequest } from './dto/patch-nickname.request';
import { PatchNickname } from './decorator/auth.decorator';
import { SignInRequest } from './dto/sign-in.request';
import { SignInResponse } from './dto/sign-in.response';
import { GoogleLoginRequest } from './dto/google-login.request';
import { AppleLoginRequest } from './dto/apple-login.request';
import { PatchCharacterRequest } from './dto/patch-character.request';
import { PatchCharacterResponse } from './dto/patch-character.response';
import { DeleteUserResponse } from '../users/dto/delete-user.response';
import { DeleteUserRequest } from '../users/dto/delete-user-request';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('ios/google')
  @ApiOperation({ summary: 'IOS 구글 로그인' })
  @ApiHeader({
    description: 'id-token',
    name: 'id-token',
    example: 'id-TOKEN',
  })
  async iosGoogleAuth(@Headers('id-token') idToken) {
    return this.authService.iosVerifyGoogle(idToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('aos/google')
  @ApiOperation({ summary: 'AOS 구글 로그인' })
  @ApiHeader({
    description: 'id-token',
    name: 'id-token',
    example: 'id-TOKEN',
  })
  async aosGoogleAuth(@Headers('id-token') idToken) {
    return this.authService.aosVerifyGoogle(idToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('ios/apple')
  @ApiOperation({ summary: 'IOS 애플 로그인' })
  @ApiHeader({
    description: 'id-token',
    name: 'id-token',
    example: 'id-TOKEN',
  })
  async iosAppleAuth(@Headers('id-token') idToken) {
    return this.authService.iosVerifyApple(idToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('aos/kakao')
  @ApiOperation({ summary: 'AOS 카카오 로그인' })
  @ApiHeader({
    description: 'id-token',
    name: 'id-token',
    example: 'id-TOKEN',
  })
  async aosKakaoAuth(@Headers('id-token') idToken) {
    return this.authService.aosVerifyKakao(idToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('ios/kakao')
  @ApiOperation({ summary: 'IOS 카카오 로그인' })
  @ApiHeader({
    description: 'id-token',
    name: 'id-token',
    example: 'id-TOKEN',
  })
  async iosKakaoAuth(@Headers('id-token') idToken) {
    return this.authService.iosVerifyKakao(idToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async logIn(@Body() signInRequest: SignInRequest) {
    return await this.authService.verifyUser(signInRequest);
  }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PatchNicknameResponse,
  })
  @ApiResponse({
    status: 2021,
    description: '닉네임을 입력해주세요.',
  })
  @ApiResponse({
    status: 2022,
    description: '닉네임이 유효하지 않습니다.',
  })
  @ApiOperation({ summary: '닉네임등록' })
  @Patch('/nickname')
  @ApiBody({ description: '닉네임 등록', type: PatchNicknameRequest })
  async patchNickname(
    @Headers('x-access-token') accessToken,
    @PatchNickname() patchNicknameRequest: PatchNicknameRequest,
  ) {
    return await this.authService.patchNickname(
      accessToken,
      patchNicknameRequest,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiResponse({
    status: 1000,
    description: '성공',
    type: PatchCharacterResponse,
  })
  @ApiOperation({ summary: '캐릭터 등록' })
  @Post('/character')
  @ApiBody({ description: '캐릭터 등록', type: PatchCharacterRequest })
  async patchCharacter(
    @Headers('x-access-token') accessToken,
    @Body() patchCharacterRequest: PatchCharacterRequest,
  ) {
    return await this.authService.editCharacter(
      accessToken,
      patchCharacterRequest,
    );
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: DeleteUserResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBody({
    description: '회원 탈퇴',
    type: DeleteUserRequest,
    required: false,
  })
  @Patch()
  deleteDream(@Headers('x-access-token') accessToken) {
    return this.authService.deleteUser(accessToken);
  }
}
