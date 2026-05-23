import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDerivationDto } from './dto/request/create-derivation.dto';
import { DerivationStatus } from '../types/derivations-status.enum';
import { UpdateDerivationDto } from './dto/request/update-derivation.dto';

const CHANTIER_INCLUDE = { chantier: { include: { market: true } } } as const;

@Injectable()
export class DerivationsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(DerivationsService.name);

  async createDerivation(createDerivationDto: CreateDerivationDto) {
    const isUserExist = await this.prisma.user.findUnique({
      where: { id: createDerivationDto.userId },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    if (createDerivationDto.chantierId) {
      const chantier = await this.prisma.chantier.findUnique({
        where: { id: createDerivationDto.chantierId },
      });
      if (!chantier) throw new NotFoundException('Chantier not found');
    }

    this.logger.log(
      `Creating derivation with data: ${JSON.stringify(createDerivationDto)}`
    );

    return this.prisma.derivation.create({
      data: {
        userId: createDerivationDto.userId,
        chantierId: createDerivationDto.chantierId ?? null,
        correctionComment: createDerivationDto.correctionComment ?? null,
        status: DerivationStatus.PENDING,
      },
      include: CHANTIER_INCLUDE,
    });
  }

  async findDerivationByUserId(userId: number) {
    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const derivations = await this.prisma.derivation.findMany({
      where: { userId: parsedUserId },
      include: CHANTIER_INCLUDE,
    });

    this.logger.log(
      `Found ${derivations.length} derivations for user ID: ${parsedUserId}`
    );

    return derivations;
  }

  async findDerivationById(derivationId: number) {
    const parsedDerivationId = Number(derivationId);
    if (isNaN(parsedDerivationId)) {
      throw new NotFoundException('Invalid derivation ID');
    }

    this.logger.log(`Finding derivation with ID: ${parsedDerivationId}`);

    const derivation = await this.prisma.derivation.findUnique({
      where: { id: parsedDerivationId },
      include: CHANTIER_INCLUDE,
    });

    if (!derivation) {
      this.logger.error(`Derivation with ID ${parsedDerivationId} not found`);
      throw new NotFoundException('Derivation not found');
    }

    return derivation;
  }

  async findAllDerivations() {
    return this.prisma.derivation.findMany({ include: CHANTIER_INCLUDE });
  }

  async updateDerivation(
    derivationId: number,
    updateDerivationDto: UpdateDerivationDto
  ) {
    const parsedDerivationId = Number(derivationId);
    if (isNaN(parsedDerivationId)) {
      throw new NotFoundException('Invalid derivation ID');
    }

    this.logger.log(`Finding derivation with ID: ${parsedDerivationId}`);

    const derivation = await this.prisma.derivation.findUnique({
      where: { id: parsedDerivationId },
    });

    if (!derivation) {
      this.logger.error(`Derivation with ID ${parsedDerivationId} not found`);
      throw new NotFoundException('Derivation not found');
    }

    this.logger.log(`Updating derivation with ID: ${parsedDerivationId}`);

    return this.prisma.derivation.update({
      where: { id: parsedDerivationId },
      data: updateDerivationDto,
      include: CHANTIER_INCLUDE,
    });
  }
}
