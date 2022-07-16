import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/users.entity';
import { Connection, getManager, Repository } from 'typeorm';
import { decodeJwt, makeResponse } from '../common/function.utils';
import { response } from '../config/response.utils';
import { OAuth2Client } from 'google-auth-library';
import { secret } from '../common/secret';
import { CharacterUser } from '../entity/character-user.entity';
import { Character } from '../entity/character.entity';
import { TitleUser } from 'src/entity/title-user.entity';
import { Dream } from '../entity/dream.entity';
import { AuthQuery } from './auth.query';
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
    private authQuery: AuthQuery,
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

      await queryRunner.manager.update(
        User,
        { id: decodeToken.sub },
        { subject: '' },
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
      const accountId = payload['sub'];

      let user = await this.userRepository.findOne({
        where: { accountId: accountId },
      });
      let accountPayload;

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        user = await this.userRepository.save({
          accountId: accountId,
        });
        accountPayload = { sub: user.id };
        data = {
          accountId: accountId,
          nickname: null,
          characterImageUrl: null,
          token: this.jwtService.sign(accountPayload),
        };
      } else {
        const characterImageUrl = await getManager()
          .createQueryBuilder(Character, 'characters')
          .innerJoin(CharacterUser, 'CU', 'characters.id = CU.characterId')
          .select('characters.characterImageUrl')
          .where('CU.userId IN (:userId)', { userId: user.id })
          .getOne();

        accountPayload = { sub: user.id };
        if (characterImageUrl == undefined) {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: null,
            token: this.jwtService.sign(accountPayload),
          };
        } else {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: characterImageUrl.characterImageUrl,
            token: this.jwtService.sign(accountPayload),
          };
        }
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
      const accountId = payload['sub'];

      let user = await this.userRepository.findOne({
        where: { accountId: accountId },
      });
      let accountPayload;

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        user = await this.userRepository.save({
          accountId: accountId,
        });
        accountPayload = { sub: user.id };
        data = {
          accountId: accountId,
          nickname: null,
          characterImageUrl: null,
          token: this.jwtService.sign(accountPayload),
        };
      } else {
        const characterImageUrl = await getManager()
            .createQueryBuilder(Character, 'characters')
            .innerJoin(CharacterUser, 'CU', 'characters.id = CU.characterId')
            .select('characters.characterImageUrl')
            .where('CU.userId IN (:userId)', { userId: user.id })
            .getOne();

        accountPayload = { sub: user.id };
        if (characterImageUrl == undefined) {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: null,
            token: this.jwtService.sign(accountPayload),
          };
        } else {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: characterImageUrl.characterImageUrl,
            token: this.jwtService.sign(accountPayload),
          };
        }
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
      let data;
      const idToken = jwt.decode(token);
      const accountId = idToken.sub;

      let user = await this.userRepository.findOne({
        where: { accountId: accountId },
      });

      let accountPayload;

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        user = await this.userRepository.save({
          accountId: accountId,
        });
        accountPayload = { sub: user.id };
        data = {
          accountId: accountId,
          nickname: null,
          characterImageUrl: null,
          token: this.jwtService.sign(accountPayload),
        };
      } else {
        const characterImageUrl = await getManager()
            .createQueryBuilder(Character, 'characters')
            .innerJoin(CharacterUser, 'CU', 'characters.id = CU.characterId')
            .select('characters.characterImageUrl')
            .where('CU.userId IN (:userId)', { userId: user.id })
            .getOne();

        accountPayload = { sub: user.id };
        if (characterImageUrl == undefined) {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: null,
            token: this.jwtService.sign(accountPayload),
          };
        } else {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: characterImageUrl.characterImageUrl,
            token: this.jwtService.sign(accountPayload),
          };
        }
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
      let data;
      const accountId = idToken.sub;

      let user = await this.userRepository.findOne({
        where: { accountId: accountId },
      });
      console.log(user);
      let accountPayload;

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        user = await this.userRepository.save({
          accountId: accountId,
        });
        accountPayload = { sub: user.id };
        data = {
          accountId: accountId,
          nickname: null,
          characterImageUrl: null,
          token: this.jwtService.sign(accountPayload),
        };
      } else {
        const characterImageUrl = await getManager()
            .createQueryBuilder(Character, 'characters')
            .innerJoin(CharacterUser, 'CU', 'characters.id = CU.characterId')
            .select('characters.characterImageUrl')
            .where('CU.userId IN (:userId)', { userId: user.id })
            .getOne();

        accountPayload = { sub: user.id };
        if (characterImageUrl == undefined) {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: null,
            token: this.jwtService.sign(accountPayload),
          };
        } else {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: characterImageUrl.characterImageUrl,
            token: this.jwtService.sign(accountPayload),
          };
        }
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
      let data;
      const accountId = idToken.sub;

      let user = await this.userRepository.findOne({
        where: { accountId: accountId },
      });
      console.log(user);
      let accountPayload;

      // 유저가 존재하지 않는 경우
      if (user == undefined) {
        user = await this.userRepository.save({
          accountId: accountId,
        });
        accountPayload = { sub: user.id };
        data = {
          accountId: accountId,
          nickname: null,
          characterImageUrl: null,
          token: this.jwtService.sign(accountPayload),
        };
      } else {
        const characterImageUrl = await getManager()
            .createQueryBuilder(Character, 'characters')
            .innerJoin(CharacterUser, 'CU', 'characters.id = CU.characterId')
            .select('characters.characterImageUrl')
            .where('CU.userId IN (:userId)', { userId: user.id })
            .getOne();

        accountPayload = { sub: user.id };
        if (characterImageUrl == undefined) {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: null,
            token: this.jwtService.sign(accountPayload),
          };
        } else {
          data = {
            accountId: accountId,
            nickname: user.nickname,
            characterImageUrl: characterImageUrl.characterImageUrl,
            token: this.jwtService.sign(accountPayload),
          };
        }
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
