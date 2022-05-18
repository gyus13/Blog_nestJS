import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Post()
  async createUser(@Body() userCreateDto: UsersCreateDto) {
    return await this.userService.createUser(userCreateDto);
  }

  @Post('login')
  async logIn(@Body() userLoginDTO: UserLogInDTO) {
    console.log(userLoginDTO);
    return await this.authService.verifyUser(userLoginDTO);
  }
}
