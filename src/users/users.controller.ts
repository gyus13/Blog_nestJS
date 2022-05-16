import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/users.create.dto';
import { UserLogInDTO } from './dto/users.login.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  // @Get('/:userId')
  // async getUser(@Param('userId') userId: number){
  //   return await this.userService.findById(userId);
  // }

  @Post()
  async createUser(@Body() userCreateDto: UsersCreateDto) {
    return await this.userService.createUser(userCreateDto);
  }

  @Post('login')
  async logIn(@Body() userLoginDTO: UserLogInDTO) {
    return await this.authService.verifyUser(userLoginDTO);
  }
}
