import { ConflictException, Injectable } from '@nestjs/common';
import { normalizeFolio } from '@repo/types';
import {
  CompletedDerivation,
  CompletedDerivationDocument,
} from './entities/completed-derivations.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCompletedDerivationDto } from './dto/create-completed-derivations.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DerivationStatus } from '../types/derivations-status.enum';

@Injectable()
export class CompletedDerivationService {
  constructor(
    @InjectModel(CompletedDerivation.name)
    private completedDerivationModel: Model<CompletedDerivationDocument>,
    private readonly prisma: PrismaService
  ) {}

  async create(dto: CreateCompletedDerivationDto) {
    const folio = normalizeFolio(dto.clientInfo.folio);
    await this.ensureFolioAvailable(folio, dto.requestedDerivationId);
    const createCompletedDerivationDto = {
      ...dto,
      clientInfo: { ...dto.clientInfo, folio },
    };

    try {
      const completedDerivationOnDatabase = await this.completedDerivationModel
        .findOne({
          requestedDerivationId:
            createCompletedDerivationDto.requestedDerivationId,
        })
        .lean();

      if (completedDerivationOnDatabase) {
        await this.prisma.derivation.update({
          where: {
            id: createCompletedDerivationDto.requestedDerivationId,
          },
          data: {
            status: DerivationStatus.REVIEWING,
            folio,
          },
        });

        return this.completedDerivationModel.findOneAndUpdate(
          {
            requestedDerivationId:
              createCompletedDerivationDto.requestedDerivationId,
          },
          { ...createCompletedDerivationDto, updatedAt: new Date() },
          { new: true }
        );
      }

      const completedDerivation = new this.completedDerivationModel(
        createCompletedDerivationDto
      );

      await this.prisma.derivation.update({
        where: {
          id: createCompletedDerivationDto.requestedDerivationId,
        },
        data: {
          status: DerivationStatus.REVIEWING,
          folio,
        },
      });

      return await completedDerivation.save();
    } catch (error) {
      console.error('Error in create method:', error);
      throw new Error('Error while creating or updating completed derivation');
    }
  }

  async findAll() {
    return await this.completedDerivationModel.find();
  }

  async findOne(id: number) {
    return await this.completedDerivationModel.findOne({
      requestedDerivationId: id,
    });
  }

  async update(id: number, dto: Partial<CompletedDerivation>) {
    const folio = dto.clientInfo?.folio
      ? normalizeFolio(dto.clientInfo.folio)
      : undefined;
    if (folio) {
      await this.ensureFolioAvailable(folio, dto.requestedDerivationId);
    }

    await this.prisma.derivation.update({
      where: {
        id: dto.requestedDerivationId,
      },
      data: {
        status: DerivationStatus.REVIEWING,
        folio,
      },
    });

    return await this.completedDerivationModel.findByIdAndUpdate(
      id,
      folio ? { ...dto, clientInfo: { ...dto.clientInfo, folio } } : dto,
      { new: true }
    );
  }

  private async ensureFolioAvailable(folio: string, derivationId: number) {
    const owner = await this.prisma.derivation.findFirst({
      where: { folio, NOT: { id: derivationId } },
      select: { id: true },
    });
    if (owner) {
      throw new ConflictException(
        `Ce folio est déjà utilisé par la dérivation n°${owner.id}`
      );
    }
  }

  remove(id: number) {
    return this.completedDerivationModel.findByIdAndDelete(id);
  }
}
