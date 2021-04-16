import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthUserGuard } from '../guards/check-user-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() userDto: UserDto) {
    try {
      return await this.usersService.register(userDto);
    } catch (error) {
      throw new HttpException('This user already exist', HttpStatus.CONFLICT);
    }
  }

  @Post('login')
  login(@Body() authDto: AuthDto) {
    return this.usersService.login(authDto);
  }

  @UseGuards(AuthUserGuard)
  @Put('changePassword')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordDto);
  }
}
