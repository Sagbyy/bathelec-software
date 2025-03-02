import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
// import { PayloadDto } from '../jwt/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(username: string, password: string) {
    // if (!username || !password) {
    //   throw new HttpException('You should to fill : username, password', 400);
    // }
    // const user = await this.usersService.findOneByUsername(username);
    // if (user && (await bcrypt.compare(password, user.password))) {
    //   // const payload: JwtPayload = {
    //   //   sub: user.id,
    //   //   username: user.username,
    //   //   role: user.role,
    //   // };
    //   return {
    //     accessToken: this.jwtService.sign(
    //       { username: user.username },
    //       {
    //         expiresIn: '30d', // Set expiresIn directly
    //       }
    //     ),
    //   };
    // }
    // throw new UnauthorizedException();
  }
}
