import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
