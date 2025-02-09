import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDerivationDto } from './dto/create-derivation.dto';

@Injectable()
export class DerivationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDerivation(createDerivationDto: CreateDerivationDto) {
    const isUserExist = await this.prisma.user.findUnique({
      where: {
        id: createDerivationDto.userId,
      },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.derivationToComplete.create({
      data: createDerivationDto,
    });
  }

  async findDerivationByUserId(userId: number) {
    return this.prisma.derivationToComplete.findMany({
      where: {
        userId,
      },
    });
  }
}
