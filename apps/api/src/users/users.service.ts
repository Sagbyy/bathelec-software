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

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user;
  }

  async findOneById(id: number) {
    if (!id) throw new BadRequestException('No ID specified');

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
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

  async findAllTechnicians() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
      },
      where: {
        role: 'technician',
      },
    });
  }
}
