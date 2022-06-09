import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Req,
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
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UsersNicknameDto} from "./dto/users.nickname.dto";

@Controller('users')
@ApiTags('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '회원조회' })
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    console.log(currentUser);
    return currentUser;
  }

  @ApiOperation({ summary: '특정 회원조회' })
  @Get('/:id')
  async getUser(@Param('id') id: number){
    return await this.userService.findUserById(id);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async createUser(@Body() userCreateDto: UsersCreateDto) {
    return await this.userService.createUser(userCreateDto);
  }

  @ApiOperation({ summary: '닉네임등록' })
  @Post('/nickname')
  async createNickname(@Body() nicknameDto: UsersNicknameDto) {
    return await this.userService.createNickname(nicknameDto);
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @Delete()
  async deleteNickname() {
    return 'nickname';
  }

  @ApiOperation({ summary: '문의하기' })
  @Post('/inquire')
  async inquire() {
    return 'nickname';
  }
}
