import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as config from 'config';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async register(userDto: UserDto) {
    try {
      const isExist = await User.findOne({
        where: { username: userDto.username },
      });
      if (isExist) {
        throw Error('User already exists');
      }

      await this.userModel.create<User>({
        ...userDto,
        password: crypto.createHmac('sha256', userDto.password).digest('hex'),
      });
      return 'User created';
    } catch (error) {
      throw Error(error.message);
    }
  }

  async login(AuthDto: AuthDto): Promise<string> {
    const { username, password } = AuthDto;

    const IJwtOptions = {
      jwtid: '',
      algorithm: 'HS256',
      expiresIn: '1 days',
    };

    const user: User = await this.userModel.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      return 'User not found';
    }

    const passwordIsValid =
      crypto.createHmac('sha256', password).digest('hex') === user.password;

    if (!passwordIsValid) {
      return 'Incorrect password';
    }

    return jwt.sign(
      { username: user.username, password: user.password },
      config.get('secret'),
      IJwtOptions,
    );
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user: User = await this.userModel.findOne({
      where: {
        username: changePasswordDto.username,
      },
    });

    if (!user) {
      return 'User not found';
    }

    user.password = crypto
      .createHmac('sha256', changePasswordDto.new_password)
      .digest('hex');

    await user.save();

    return 'Password updated';
  }
}
