import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByUsername(username: string) {
    if (!username) throw new BadRequestException('username must be a string');

    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOneById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    if (!email || !username || !password || !firstName || !lastName) {
      throw new HttpException(
        'You should to fill : email, username, password, firstName, lastName',
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'technician',
      },
    });
  }
}
