import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import * as config from 'config';

@Injectable()
export class AuthUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (
      req.headers.authorization &&
      (req.headers.authorization as string).split(' ')[0] === 'Bearer'
    ) {
      const token = (req.headers.authorization as string).split(' ')[1];
      const decoded: any = jwt.verify(token, config.get('secret'));
      const user = await User.findOne<User>({
        where: {
          username: decoded.username,
          password: decoded.password,
        },
      });
      if (!user) {
        throw Error('User not found');
      }
      req.body.username = decoded.username;
      req.body.password = decoded.password;
      return true;
    } else {
      throw new HttpException('User unauthorized', HttpStatus.FORBIDDEN);
    }
  }
}
