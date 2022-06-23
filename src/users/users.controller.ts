import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UserDTO } from './dto/users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async getUser(@Param('id') id: string) {
    return await this.userService.findUserById(id);
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
