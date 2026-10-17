import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationStatus } from '../types/derivations-status.enum';
import { CreateChantierDto } from './dto/request/create-chantier.dto';
import { UpdateChantierDto } from './dto/request/update-chantier.dto';

type ScheduleInput = Pick<CreateChantierDto, 'startDate' | 'endDate'>;

type ChantierInput = ScheduleInput &
  Partial<Pick<CreateChantierDto, 'internalAffaireNumber'>>;

const normalizeAffaireNumber = (value: string) => value.trim().toUpperCase();

const toDate = (value: string | null | undefined) =>
  value ? new Date(value) : value;

const startOfTodayUtc = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

@Injectable()
export class ChantiersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChantierDto) {
    const market = await this.prisma.market.findUnique({
      where: { id: dto.marketId },
    });
    if (!market) throw new NotFoundException('Market not found');
    this.ensureValidSchedule(dto);
    return this.prisma.chantier.create({
      data: this.toChantierData(dto),
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

  async findScheduledForUser(userId: number) {
    const memberships = await this.prisma.siteTeamMembership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((membership) => membership.teamId);

    return this.prisma.chantier.findMany({
      where: {
        startDate: { gte: startOfTodayUtc() },
        derivations: {
          some: { OR: [{ userId }, { teamId: { in: teamIds } }] },
        },
      },
      include: { market: true },
      orderBy: { startDate: 'asc' },
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
    const chantier = await this.findOne(id);
    this.ensureValidSchedule({
      startDate:
        dto.startDate === undefined
          ? chantier.startDate?.toISOString()
          : dto.startDate,
      endDate:
        dto.endDate === undefined
          ? chantier.endDate?.toISOString()
          : dto.endDate,
    });
    return this.prisma.chantier.update({
      where: { id },
      data: this.toChantierData(dto),
      include: { market: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.chantier.delete({ where: { id } });
  }

  private toChantierData<T extends ChantierInput>(dto: T) {
    return {
      ...dto,
      internalAffaireNumber:
        dto.internalAffaireNumber === undefined
          ? undefined
          : normalizeAffaireNumber(dto.internalAffaireNumber),
      startDate: toDate(dto.startDate),
      endDate: toDate(dto.endDate),
    };
  }

  private ensureValidSchedule({ startDate, endDate }: ScheduleInput) {
    if (endDate && !startDate) {
      throw new BadRequestException('An end date requires a start date');
    }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException('End date must not precede start date');
    }
  }
}
