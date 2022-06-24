import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { PatchNicknameResponse } from './dto/patch-nickname.response';
import { PatchNicknameRequest } from './dto/patch-nickname.request';
import { PatchNickname } from './decorator/auth.decorator';
import { SignInRequest } from './dto/sign-in.request';
import { SignInResponse } from './dto/sign-in.response';
import { AddTicketRequest } from '../ticket/dto/add-ticket.request';
import { GoogleLoginRequest } from './dto/google-login.request';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiOperation({ summary: '구글 소셜로그인' })
  // @Get('google') // 1
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {
  //   return 'googleAuth';
  // }
  //
  // @ApiOperation({ summary: '구글 소셜로그인 콜백' })
  // @Get('google/callback') // 2
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   return this.authService.googleLogin(req);
  // }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('ios/google')
  @ApiOperation({ summary: 'IOS 구글 로그인' })
  @ApiQuery({ description: 'IOS 구글 로그인', type: GoogleLoginRequest })
  async iosGoogleAuth(@Body() googleLoginRequest: GoogleLoginRequest) {
    return this.authService.iosVerifyGoogle(googleLoginRequest.token);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: SignInResponse,
  })
  @Post('aos/google')
  @ApiOperation({ summary: 'AOS 구글 로그인' })
  @ApiQuery({ description: 'AOS 구글 로그인', type: GoogleLoginRequest })
  async aosGoogleAuth(@Body() googleLoginRequest: GoogleLoginRequest) {
    return this.authService.aosVerifyGoogle(googleLoginRequest.token);
  }
  //
  // @Post('apple')
  // async appleAuth(@Body() token) {
  //   return this.authService.verifyApple(token);
  // }

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
  async patchNickname(
    @Headers('x-access-token') accessToken,
    @PatchNickname() patchNicknameRequest: PatchNicknameRequest,
  ) {
    return await this.authService.patchNickname(
      accessToken,
      patchNicknameRequest,
    );
  }
}
