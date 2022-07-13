import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/users.entity';
import { Connection, Repository } from 'typeorm';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { OAuth2Client } from 'google-auth-library';
import { secret } from '../common/secret';
import { CharacterUser } from '../entity/character-user.entity';
import { Character } from '../entity/character.entity';
import { TitleUser } from 'src/entity/title-user.entity';
const client = new OAuth2Client(secret.ios_google_client_id);
// const fs = require('fs');
const jwt = require('jsonwebtoken');
// const path = require('path');
// const AppleAuth = require('apple-auth');
//
// const appleConfig = fs.readFileSync('./configuration/config.json');
// const auth = new AppleAuth(
//   appleConfig,
//   path.join(__dirname, `./configuration/${appleConfig.private_key_path}`),
// );

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
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
      await queryRunner.manager.update(
        User,
        { id: decodeToken.sub },
        { nickname: patchNicknameRequest.nickname },
      );

      const titleUser = new TitleUser();
      titleUser.userId = decodeToken.sub;
      titleUser.titleId = 1;
      await queryRunner.manager.save(titleUser);

      const data = {
        id: decodeToken.sub,
        nickname: patchNicknameRequest.nickname,
      };

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
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
      let data = {};
      const payload = ticket.getPayload();
      const userId = payload['sub'];

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const payload1 = { sub: userId };

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        await this.userRepository.save({
          id: userId,
        });
        data = {
          id: userId,
          nickname: null,
          token: this.jwtService.sign(payload1),
        };
      } else {
        data = {
          id: userId,
          nickname: user.nickname,
          token: this.jwtService.sign(payload1),
        };
      }

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      // Rollback
      console.log(error);
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
      let data = {};
      const payload = ticket.getPayload();
      const userId = payload['sub'];

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      const payload1 = { sub: userId };

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        await this.userRepository.save({
          id: userId,
        });
        data = {
          id: userId,
          nickname: null,
          token: this.jwtService.sign(payload1),
        };
      } else {
        data = {
          id: userId,
          nickname: user.nickname,
          token: this.jwtService.sign(payload1),
        };
      }

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async iosVerifyApple(token) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const response1 = await auth.accessToken(token);
      const idToken = jwt.decode(token);
      const userId = idToken.sub;

      console.log(userId);
      let data;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const payload1 = { sub: userId };

      //유저가 존재하지 않는경우
      if (user == undefined) {
        await this.userRepository.save({
          id: userId,
        });
        data = {
          id: userId,
          nickname: null,
          token: this.jwtService.sign(payload1),
        };
      } else {
        console.log(user);
        data = {
          id: userId,
          nickname: user.nickname,
          token: this.jwtService.sign(payload1),
        };
      }

      const result = makeResponse(response.SUCCESS, data);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      // Rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async iosVerifyKakao(token) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const response1 = await auth.accessToken(token);
      const idToken = jwt.decode(token);
      const userId = idToken.sub;

      console.log(userId);
      let data;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const payload1 = { sub: userId };

      //유저가 존재하지 않는경우
      if (user == undefined) {
        await this.userRepository.save({
          id: userId,
        });
        data = {
          id: userId,
          nickname: null,
          token: this.jwtService.sign(payload1),
        };
      } else {
        console.log(user);
        data = {
          id: userId,
          nickname: user.nickname,
          token: this.jwtService.sign(payload1),
        };
      }

      const result = makeResponse(response.SUCCESS, data);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      // Rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async aosVerifyKakao(token) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const response1 = await auth.accessToken(token);
      const idToken = jwt.decode(token);
      const userId = idToken.sub;

      console.log(userId);
      let data;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const payload1 = { sub: userId };

      //유저가 존재하지 않는경우
      if (user == undefined) {
        await this.userRepository.save({
          id: userId,
        });
        data = {
          id: userId,
          nickname: null,
          token: this.jwtService.sign(payload1),
        };
      } else {
        console.log(user);
        data = {
          id: userId,
          nickname: user.nickname,
          token: this.jwtService.sign(payload1),
        };
      }

      const result = makeResponse(response.SUCCESS, data);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      // Rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async editCharacter(accessToken, patchCharacterRequest) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);
      const characterUser = new CharacterUser();
      characterUser.userId = decodeToken.sub;
      characterUser.characterId = patchCharacterRequest.characterId;
      await queryRunner.manager.save(characterUser);

      const character = await this.characterRepository.findOne({
        where: { id: patchCharacterRequest.characterId },
      });
      const data = {
        characterImageUrl: character.characterImageUrl,
      };

      const result = makeResponse(response.SUCCESS, data);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    }
  }

  async deleteUser(accessToken) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const decodeToken = await decodeJwt(accessToken);

      await queryRunner.manager.delete(User, { id: decodeToken.sub });

      const data = {
        id: decodeToken.sub,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
