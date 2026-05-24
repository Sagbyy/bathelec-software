import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationStatus } from '../types/derivations-status.enum';
import { CreateChantierDto } from './dto/request/create-chantier.dto';
import { UpdateChantierDto } from './dto/request/update-chantier.dto';

@Injectable()
export class ChantiersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChantierDto) {
    const market = await this.prisma.market.findUnique({
      where: { id: dto.marketId },
    });
    if (!market) throw new NotFoundException('Market not found');
    return this.prisma.chantier.create({
      data: dto,
      include: { market: true },
    });
  }

  findAll() {
    return this.prisma.chantier.findMany({ include: { market: true } });
  }

  findOngoing() {
    return this.prisma.chantier.findMany({
      where: {
        OR: [
          { derivations: { none: {} } },
          {
            derivations: {
              some: { status: { not: DerivationStatus.COMPLETED } },
            },
          },
        ],
      },
      include: { market: true, derivations: true },
    });
  }

  findFinished() {
    return this.prisma.chantier.findMany({
      where: {
        derivations: {
          some: {},
          every: { status: DerivationStatus.COMPLETED },
        },
      },
      include: { market: true, derivations: true },
    });
  }

  async findOne(id: number) {
    const chantier = await this.prisma.chantier.findUnique({
      where: { id },
      include: { market: true },
    });
    if (!chantier) throw new NotFoundException('Chantier not found');
    return chantier;
  }

  async update(id: number, dto: UpdateChantierDto) {
    await this.findOne(id);
    return this.prisma.chantier.update({
      where: { id },
      data: dto,
      include: { market: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.chantier.delete({ where: { id } });
  }
}
