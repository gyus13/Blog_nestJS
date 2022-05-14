import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { UsersRepository } from './users.repository';
import { UsersCreateDto } from './dto/users.create.dto';
import * as bcrypt from 'bcrypt';
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

    await this.usersRepository.save({
      ...userCreateDto,
      password: hashedPassword,
    });
  }
  // async findById(userId: number) {
  //   const user = await this.userRepository.findOne({ userId });
  //   if (!user) {
  //     throw new NotFoundException(`user id ${userId} not found`);
  //   }
  //   return user;
  // }
  //
}
