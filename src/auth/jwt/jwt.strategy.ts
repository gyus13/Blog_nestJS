import { Payload } from './jwt.payload';
import { UsersService } from '../../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    try {
      const user = await this.usersService.findUserById(payload.sub);
      if (user) {
        return user;
      } else {
        throw new Error('해당하는 유저는 없습니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
