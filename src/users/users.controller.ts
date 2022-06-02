import {
  Body,
  Controller,
  Get,
  Param,
  Post, Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/users.create.dto';
import { UserLogInDTO } from '../auth/dto/users.login.dto';
import { AuthService } from '../auth/auth.service';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UserDTO } from './dto/users.dto';
import {ApiOperation} from "@nestjs/swagger";

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '회원조회'})
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    console.log(currentUser);
    return currentUser;
  }

  // @Get('/:userId')
  // async getUser(@Param('userId') userId: number){
  //   return await this.userService.findById(userId);
  // }

  @ApiOperation({ summary: '회원가입'})
  @Post()
  async createUser(@Body() userCreateDto: UsersCreateDto) {
    return await this.userService.createUser(userCreateDto);
  }

  @ApiOperation({ summary: '로그인'})
  @Post('login')
  async logIn(@Body() userLoginDTO: UserLogInDTO) {
    console.log(userLoginDTO);
    return await this.authService.verifyUser(userLoginDTO);
  }

  @Get('google') // 1
  // @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return 'googleAuth';
  }

  @Get('google/callback') // 2
  // @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
