import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto} from "./dto/users.create.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  @Get('/:id')
  async getUser(@Param('id') userId: string): Promise<ResponseUserDto> {
    return await this.userService.findById(userId);
  }

  @Post()
  async createUser(@Body() userCreateDto: UsersCreateDto){
    return await this.userService.createUser(userCreateDto);
  }
}
