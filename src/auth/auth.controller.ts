import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import { UserLogInDTO } from './dto/users.login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async logIn(@Body() userLoginDTO: UserLogInDTO) {
    console.log(userLoginDTO);
    return await this.authService.verifyUser(userLoginDTO);
  }

  @ApiOperation({ summary: '구글 소셜로그인' })
  @Get('google') // 1
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return 'googleAuth';
  }

  @ApiOperation({ summary: '구글 소셜로그인 콜백' })
  @Get('google/callback') // 2
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
