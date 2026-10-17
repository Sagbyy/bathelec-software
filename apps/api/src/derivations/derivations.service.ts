import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDerivationDto } from './dto/request/create-derivation.dto';
import { DerivationStatus } from '../types/derivations-status.enum';
import { UpdateDerivationDto } from './dto/request/update-derivation.dto';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';

const CHANTIER_INCLUDE = {
  chantier: { include: { market: true } },
  team: { select: { id: true, name: true } },
  user: { select: { id: true, firstName: true, lastName: true } },
} as const;

const MANAGEMENT_ROLES: Role[] = [Role.ADMIN, Role.SUPERVISOR];

@Injectable()
export class DerivationsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(DerivationsService.name);

  async createDerivation(
    createDerivationDto: CreateDerivationDto,
    actor: AuthenticatedUser
  ) {
    const { teamId } = createDerivationDto;
    await this.ensureTeamExists(teamId);

    const isManagement = MANAGEMENT_ROLES.includes(actor.role as Role);
    if (!isManagement && !(await this.isTeamMember(teamId, actor.userId))) {
      throw new ForbiddenException(
        'Only a member of the team can create a derivation for it'
      );
    }

    const userId =
      actor.role === Role.TECHNICIAN
        ? actor.userId
        : createDerivationDto.userId;

    if (userId !== undefined) {
      await this.ensureUserExists(userId);
      await this.ensureTeamMember(teamId, userId);
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
        teamId,
        userId: userId ?? null,
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
      data: {
        correctionComment: updateDerivationDto.correctionComment,
        status: updateDerivationDto.status,
      },
      include: CHANTIER_INCLUDE,
    });
  }

  async assignTeam(derivationId: number, teamId: number) {
    const derivation = await this.getDerivationOrThrow(derivationId);
    await this.ensureTeamExists(teamId);

    const keepsAssignee =
      derivation.userId !== null &&
      (await this.isTeamMember(teamId, derivation.userId));

    return this.prisma.derivation.update({
      where: { id: derivation.id },
      data: { teamId, userId: keepsAssignee ? derivation.userId : null },
      include: CHANTIER_INCLUDE,
    });
  }

  async assignUser(
    derivationId: number,
    assigneeId: number | null,
    actor: AuthenticatedUser
  ) {
    const derivation = await this.getDerivationOrThrow(derivationId);
    const teamId = this.requireTeam(derivation);

    if (
      actor.role === Role.SITE_MANAGER &&
      !(await this.isTeamMember(teamId, actor.userId))
    ) {
      throw new ForbiddenException(
        'Only a site manager of the derivation team can assign it'
      );
    }

    if (assigneeId !== null) {
      await this.ensureTeamMember(teamId, assigneeId);
    }

    return this.prisma.derivation.update({
      where: { id: derivation.id },
      data: { userId: assigneeId },
      include: CHANTIER_INCLUDE,
    });
  }

  async claimDerivation(derivationId: number, actor: AuthenticatedUser) {
    const derivation = await this.getDerivationOrThrow(derivationId);
    const teamId = this.requireTeam(derivation);

    if (!(await this.isTeamMember(teamId, actor.userId))) {
      throw new ForbiddenException(
        'Only a member of the derivation team can claim it'
      );
    }

    if (derivation.userId === actor.userId) {
      return this.findDerivationById(derivation.id);
    }

    if (derivation.userId !== null) {
      throw new ConflictException('Derivation is already assigned');
    }

    const { count } = await this.prisma.derivation.updateMany({
      where: { id: derivation.id, userId: null },
      data: { userId: actor.userId },
    });

    if (count === 0) {
      throw new ConflictException('Derivation is already assigned');
    }

    return this.findDerivationById(derivation.id);
  }

  async findMyDerivations(actor: AuthenticatedUser) {
    const memberships = await this.prisma.siteTeamMembership.findMany({
      where: { userId: actor.userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((membership) => membership.teamId);

    const where =
      actor.role === Role.SITE_MANAGER
        ? { OR: [{ teamId: { in: teamIds } }, { userId: actor.userId }] }
        : {
            OR: [
              { userId: actor.userId },
              { userId: null, teamId: { in: teamIds } },
            ],
          };

    return this.prisma.derivation.findMany({
      where,
      include: CHANTIER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getDerivationOrThrow(derivationId: number) {
    const parsedDerivationId = Number(derivationId);
    if (isNaN(parsedDerivationId)) {
      throw new NotFoundException('Invalid derivation ID');
    }

    const derivation = await this.prisma.derivation.findUnique({
      where: { id: parsedDerivationId },
    });

    if (!derivation) {
      throw new NotFoundException('Derivation not found');
    }

    return derivation;
  }

  private requireTeam(derivation: { teamId: number | null }) {
    if (derivation.teamId === null) {
      throw new BadRequestException(
        'Derivation must be assigned to a team first'
      );
    }
    return derivation.teamId;
  }

  private async ensureTeamExists(teamId: number) {
    const team = await this.prisma.siteTeam.findUnique({
      where: { id: teamId },
    });
    if (!team) throw new NotFoundException('Team not found');
  }

  private async ensureUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
  }

  private async isTeamMember(teamId: number, userId: number) {
    const membership = await this.prisma.siteTeamMembership.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });
    return membership !== null;
  }

  private async ensureTeamMember(teamId: number, userId: number) {
    if (!(await this.isTeamMember(teamId, userId))) {
      throw new BadRequestException('User is not a member of the team');
    }
  }
}
