import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketDto } from './dto/request/create-market.dto';
import { UpdateMarketDto } from './dto/request/update-market.dto';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMarketDto) {
    return this.prisma.market.create({ data: dto });
  }

  findAll() {
    return this.prisma.market.findMany({ include: { chantiers: true } });
  }

  async findOne(id: number) {
    const market = await this.prisma.market.findUnique({
      where: { id },
      include: { chantiers: true },
    });
    if (!market) throw new NotFoundException('Market not found');
    return market;
  }

  async update(id: number, dto: UpdateMarketDto) {
    await this.findOne(id);
    return this.prisma.market.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.market.delete({ where: { id } });
  }
}
