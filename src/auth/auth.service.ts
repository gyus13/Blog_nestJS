import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Connection, Repository } from 'typeorm';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { OAuth2Client } from 'google-auth-library';
import { secret } from '../common/secret';
const client = new OAuth2Client(secret.ios_google_client_id);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private connection: Connection,
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

  async patchNickname(accessToken, patchNicknameRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);
      console.log(decodeToken);
      await queryRunner.manager.update(
        User,
        { id: decodeToken.sub },
        { nickname: patchNicknameRequest.nickname },
      );
      const data = {
        nickname: patchNicknameRequest.nickname,
      };

      // const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async iosVerifyGoogle(token) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: secret.ios_google_client_id, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        const user = new User();
        user.id = userId;
        const createUserData = await queryRunner.manager.save(user);
      }
      const payload1 = { sub: userId };

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        id: userId,
        token: this.jwtService.sign(payload1),
      };
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async aosVerifyGoogle(token) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: secret.aos_google_client_id, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        const user = new User();
        user.id = userId;
        const createUserData = await queryRunner.manager.save(user);
      }
      const payload1 = { sub: userId };

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        id: userId,
        token: this.jwtService.sign(payload1),
      };
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
