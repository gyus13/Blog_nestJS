import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLogInDTO } from './dto/users.login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async googleLogin(userLoginDto: UserLogInDTO) {}

  async verifyUser(userLoginDto: UserLogInDTO) {
    const { email, password } = userLoginDto;

    //* 해당하는 email이 있는가
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    //* password 일치하는가
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
