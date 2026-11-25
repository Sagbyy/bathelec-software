import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  canFillDerivation,
  canViewDerivation,
  DerivationActor,
  DerivationOwnership,
  isEditableInTheField,
} from './derivation-access.policy';

@Injectable()
export class DerivationAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async findViewableOrThrow(derivationId: number, actor: DerivationActor) {
    const derivation = await this.findOrThrow(derivationId);
    const isMember = await this.isActorTeamMember(derivation, actor);

    if (!canViewDerivation(derivation, actor, isMember)) {
      throw new ForbiddenException(
        'You are not allowed to access this derivation'
      );
    }

    return derivation;
  }

  async findFillableOrThrow(derivationId: number, actor: DerivationActor) {
    const derivation = await this.findOrThrow(derivationId);
    const isMember = await this.isActorTeamMember(derivation, actor);

    if (!canFillDerivation(derivation, actor, isMember)) {
      throw new ForbiddenException(
        'Only the assigned technician can fill this derivation report'
      );
    }

    if (!isEditableInTheField(derivation.status)) {
      throw new ConflictException(
        'This derivation report can no longer be modified'
      );
    }

    return derivation;
  }

  private async findOrThrow(derivationId: number) {
    const id = Number(derivationId);
    if (isNaN(id)) {
      throw new NotFoundException('Invalid derivation ID');
    }

    const derivation = await this.prisma.derivation.findUnique({
      where: { id },
    });

    if (!derivation) {
      throw new NotFoundException('Derivation not found');
    }

    return derivation;
  }

  private async isActorTeamMember(
    derivation: DerivationOwnership,
    actor: DerivationActor
  ) {
    if (derivation.teamId === null) {
      return false;
    }

    const membership = await this.prisma.siteTeamMembership.findUnique({
      where: {
        userId_teamId: { userId: actor.userId, teamId: derivation.teamId },
      },
    });

    return membership !== null;
  }
}
