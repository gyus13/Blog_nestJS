import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersCreateDto } from './dto/users.create.dto';
import * as bcrypt from 'bcrypt-nodejs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(userCreateDto: UsersCreateDto) {
    const { email, password } = userCreateDto;
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.usersRepository.save({
      ...userCreateDto,
      password: hashedPassword,
    });

    return result;
  }

  async findUserById(id: string) {
    try {
      const user = await this.usersRepository.findOne({ id });
      if(!user) throw new Error()
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.')
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }
}
