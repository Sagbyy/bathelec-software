import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDerivationDto } from './dto/request/create-derivation.dto';
import { DerivationStatus } from '../types/derivations-status.enum';

@Injectable()
export class DerivationsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(DerivationsService.name);

  async createDerivation(createDerivationDto: CreateDerivationDto) {
    const isUserExist = await this.prisma.user.findUnique({
      where: {
        id: createDerivationDto.userId,
      },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(
      `Creating derivation with data: ${JSON.stringify(createDerivationDto)}`
    );

    return this.prisma.derivation.create({
      data: {
        ...createDerivationDto,
        status: DerivationStatus.PENDING,
      },
    });
  }

  async findDerivationByUserId(userId: number) {
    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const derivations = await this.prisma.derivation.findMany({
      where: {
        userId: parsedUserId,
      },
    });

    this.logger.log(
      `Found ${derivations.length} derivations for user ID: ${parsedUserId}`
    );
    this.logger.log(`Derivations: ${JSON.stringify(derivations, null, 2)}`);

    return derivations;
  }

  async findDerivationById(derivationId: number) {
    const parsedDerivationId = Number(derivationId);
    if (isNaN(parsedDerivationId)) {
      throw new NotFoundException('Invalid derivation ID');
    }

    this.logger.log(`Finding derivation with ID: ${parsedDerivationId}`);

    const derivation = await this.prisma.derivation.findUnique({
      where: {
        id: parsedDerivationId,
      },
    });

    if (!derivation) {
      this.logger.error(`Derivation with ID ${parsedDerivationId} not found`);
      throw new NotFoundException('Derivation not found');
    }

    return derivation;
  }

  async findAllDerivations() {
    return this.prisma.derivation.findMany();
  }
}
