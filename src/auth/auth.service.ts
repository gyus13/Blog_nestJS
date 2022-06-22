import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { OAuth2Client } from 'google-auth-library';
import {secret} from "../common/secret";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async verifyUser(signInRequest) {
    //* 해당하는 email이 있는가
    const user = await this.userService.findUserByEmail(signInRequest.email);
    if (!user) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    const payload = { email: signInRequest.email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async patchNickname(patchNicknameRequest) {
    try {
      // await this.userRepository
      //     .update( patchNicknameRequest.nickname )
      //
      const data = {
        nickname: patchNicknameRequest.nickname,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      return response.ERROR;
    }
  }

  async verify(token) {
    const client = new OAuth2Client(secret.google_client_id);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: secret.google_client_id, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
      token: this.jwtService.sign(userid),
    };
  }

  async verifyApple(token) {
    const client = new OAuth2Client(secret.google_client_id);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: secret.google_client_id, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
      token: this.jwtService.sign(userid),
    };
  }
}
