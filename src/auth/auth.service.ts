import { InSignUpDto } from './dto/in_sign_up.dto';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InUpdateUserDto } from './dto/in_update_user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async getMe(user: User): Promise<User> {
    const { _id } = user;
    return this.usersRepository.findOne({ _id });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }
  async getUser(_id: string): Promise<User> {
    return this.usersRepository.findOne({ _id });
  }

  async signUp(authCredentialsDto: InSignUpDto): Promise<void> {
    return this.usersRepository.create(authCredentialsDto);
  }

  async signIn(
    AuthCredentialsDto: InSignUpDto,
  ): Promise<{ accessToken: string }> {
    const { email } = AuthCredentialsDto;
    const user = await this.usersRepository.findOne({ email });

    // if (user && (await bcrypt.compare(password, user.password))) {
    const payload = { email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
    // } else {
    //   throw new UnauthorizedException('login failed');
    // }
  }

  async updateUser(id: string, inSignUpDto: InUpdateUserDto): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ id }, inSignUpDto);
  }
}
