import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersCreateDto } from './dto/users.create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(userCreateDto: UsersCreateDto){
    const { email, password } = userCreateDto;
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다')
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.save({
      ...userCreateDto,
      password: hashedPassword,
    });
  }
}
