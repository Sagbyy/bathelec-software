import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../jwt/jwt.strategy';

@Module({
  imports: [UsersModule],
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    JwtService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
