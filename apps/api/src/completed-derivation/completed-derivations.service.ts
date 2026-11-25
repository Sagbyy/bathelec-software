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
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { DerivationAccessService } from '../derivations/access/derivation-access.service';

@Injectable()
export class CompletedDerivationService {
  constructor(
    @InjectModel(CompletedDerivation.name)
    private completedDerivationModel: Model<CompletedDerivationDocument>,
    private readonly prisma: PrismaService,
    private readonly derivationAccess: DerivationAccessService
  ) {}

  async create(dto: CreateCompletedDerivationDto, actor: AuthenticatedUser) {
    const replayedReport = await this.findReplayedSubmission(dto, actor);
    if (replayedReport) {
      return replayedReport;
    }

    const derivation = await this.derivationAccess.findFillableOrThrow(
      dto.requestedDerivationId,
      actor
    );
    const folio = normalizeFolio(dto.clientInfo.folio);
    await this.ensureFolioAvailable(folio, derivation.id);
    const report = {
      ...dto,
      requestedDerivationId: derivation.id,
      clientInfo: { ...dto.clientInfo, folio },
    };

    try {
      const existingReport = await this.completedDerivationModel
        .findOne({ requestedDerivationId: derivation.id })
        .lean();

      await this.prisma.derivation.update({
        where: { id: derivation.id },
        data: {
          status: DerivationStatus.REVIEWING,
          folio,
          ...(derivation.userId === null ? { userId: actor.userId } : {}),
        },
      });

      if (existingReport) {
        return this.completedDerivationModel.findOneAndUpdate(
          { requestedDerivationId: derivation.id },
          { ...report, updatedAt: new Date() },
          { new: true }
        );
      }

      return await new this.completedDerivationModel(report).save();
    } catch (error) {
      console.error('Error in create method:', error);
      throw new Error('Error while creating or updating completed derivation');
    }
  }

  async findAll() {
    return await this.completedDerivationModel.find();
  }

  async findOne(derivationId: number, actor: AuthenticatedUser) {
    const derivation = await this.derivationAccess.findViewableOrThrow(
      derivationId,
      actor
    );

    return await this.completedDerivationModel.findOne({
      requestedDerivationId: derivation.id,
    });
  }

  private async findReplayedSubmission(
    dto: CreateCompletedDerivationDto,
    actor: AuthenticatedUser
  ) {
    if (!dto.clientSubmissionId) {
      return null;
    }

    const report = await this.completedDerivationModel
      .findOne({
        requestedDerivationId: dto.requestedDerivationId,
        clientSubmissionId: dto.clientSubmissionId,
      })
      .lean();
    if (!report) {
      return null;
    }

    await this.derivationAccess.findViewableOrThrow(
      dto.requestedDerivationId,
      actor
    );
    return report;
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
}
