import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLogInDTO } from '../users/dto/users.login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async verifyUser(userLoginDto: UserLogInDTO) {
    const { email, password } = userLoginDto;

    //* 해당하는 email이 있는가
    const user = await this.usersRepository.findOne({ email });
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
