import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto} from "./dto/users.create.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  @Post()
  async createUser(@Body() userCreateDto: UsersCreateDto){
    return await this.userService.createUser(userCreateDto);
  }
}
